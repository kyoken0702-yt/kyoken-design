import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const html = fs.readFileSync(new URL("../admin/index.html", import.meta.url), "utf8");
const controls = Array.from({ length: 5 }, () => ({ disabled: false }));
const publishBtn = controls[0];
const editButtons = controls.slice(1, 3);
const context = vm.createContext({
  canWrite: false, busy: false, publishBtn,
  document: { querySelectorAll: () => controls },
  recordList: { querySelectorAll: () => editButtons },
  setStatus: () => {}
});
const start = html.indexOf("      function updateControls()");
const end = html.indexOf('      var $ =', start);
vm.runInContext(html.slice(start, end), context);
context.updateControls();
assert.equal(publishBtn.disabled, true);
assert.equal(context.canMutate(), false);
context.canWrite = true;
context.updateControls();
assert.equal(context.canMutate(), true);
context.setBusy(true);
assert.ok(controls.every(control => control.disabled));
assert.equal(context.canMutate(), false);
context.canWrite = false;
context.setBusy(false);
assert.equal(publishBtn.disabled, true);
assert.ok(editButtons.every(control => control.disabled));
const publish = html.slice(html.indexOf("async function publishRecord()"), html.indexOf("async function deleteRecord("));
assert.ok(publish.indexOf("clearForm();") < publish.indexOf('setStatus("发布成功'));
assert.ok(publish.indexOf("clearForm();") < publish.indexOf("setProgress(1, 1)"));
console.log("Admin controls check passed: login gating, shared operation lock, expiry, and persistent success feedback.");
