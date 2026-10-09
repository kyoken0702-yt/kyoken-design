import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const admin = fs.readFileSync(new URL("admin/index.html", root), "utf8");
const generator = fs.readFileSync(new URL("scripts/rebuild-v5.mjs", root), "utf8");
const labels = vm.runInNewContext(`(${admin.match(/var channelLabels = (\{[\s\S]*?\n      \});/)[1]})`);
const channels = vm.runInNewContext(generator.match(/const recordChannels = ([\s\S]*?);/)[1]);
const options = [...admin.matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)];
for (const channel of channels) {
  assert.ok(options.some(([, id, title]) => id === channel.id && title === labels[id].title));
  for (const code of ["ja", "zh", "en"]) {
    assert.equal(labels[channel.id].i18n[code].title, channel.title[code]);
  }
}
assert.equal(labels.enamel.title, "珐琅磁吸板制作工厂");
const functions = generator.slice(generator.indexOf("function factoryChannelSections("), generator.indexOf("function productCards("));
const context = vm.createContext({
  recordChannels: channels,
  records: [],
  recordCard: () => "ENAMEL_MEDIA",
  mediaGrid: () => "EMPTY"
});
vm.runInContext(functions, context);
assert.ok(!context.factoryChannelSections("zh").includes(labels.enamel.title));
context.records.push({ module: "factory", channel: "enamel" });
for (const code of ["ja", "zh", "en"]) {
  for (const compact of [true, false]) {
    const output = context.factoryChannelSections(code, compact);
    assert.ok(output.includes(labels.enamel.i18n[code].title));
    assert.equal(output.split("ENAMEL_MEDIA").length - 1, 1);
  }
}
assert.equal(context.inferChannel({ title: "珐琅磁吸板制作工厂" }), "enamel");
assert.equal(context.recordDate({ createdAt: "2026-07-07T15:15:52.295Z" }), "2026-07-08");
assert.equal(context.recordDate({ createdAt: "invalid" }), "");
const advertising = [
  { id: "october", module: "factory", channel: "advertising", createdAt: "2026-10-06T08:24:05.445Z" },
  { id: "july", module: "factory", channel: "advertising", createdAt: "2026-07-05T00:00:00+09:00" }
];
context.records = advertising;
context.recordCard = (record, code, compact, options) => options.recordLabel;
for (const code of ["ja", "zh", "en"]) {
  for (const compact of [true, false]) {
    const output = context.factoryChannelSections(code, compact);
    assert.ok(output.includes("2026-10-06"));
    assert.ok(output.includes("2026-07-05"));
  }
}
context.records = [advertising[0], { ...advertising[0], id: "same-day-separate-record" }];
for (const code of ["ja", "zh", "en"]) {
  const output = context.factoryChannelSections(code);
  assert.ok(output.includes(`${{ ja: "記録", zh: "记录", en: "Record" }[code]} 1`));
  assert.ok(output.includes(`${{ ja: "記録", zh: "记录", en: "Record" }[code]} 2`));
}
console.log("Upload channel check passed: admin labels, three languages, factory routing, and empty state.");
