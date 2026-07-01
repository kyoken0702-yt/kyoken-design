function getCookie(req, name) {
  const cookies = String(req.headers.cookie || "").split(";").map((item) => item.trim());
  const target = cookies.find((item) => item.startsWith(`${name}=`));
  return target ? decodeURIComponent(target.slice(name.length + 1)) : "";
}

function oauthResultPage(provider, status, payload) {
  const message = `authorization:${provider}:${status}:${JSON.stringify(payload)}`;
  return `<!doctype html>
<html>
<head><meta charset="utf-8"><title>CMS Login</title></head>
<body>
<script>
(function () {
  function receiveMessage(event) {
    if (!event || !event.origin) return;
    window.opener.postMessage(${JSON.stringify(message)}, event.origin);
    window.close();
  }
  window.addEventListener("message", receiveMessage, false);
  if (window.opener) {
    window.opener.postMessage("authorizing:github", "*");
  }
})();
</script>
<p>Authentication complete. You can close this window.</p>
</body>
</html>`;
}

export default async function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    res.status(500).send("Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET.");
    return;
  }

  const expectedState = getCookie(req, "kyoken_cms_oauth_state");
  if (!expectedState || expectedState !== req.query.state) {
    res.status(400).send("Invalid OAuth state.");
    return;
  }

  if (!req.query.code) {
    res.status(400).send("Missing OAuth code.");
    return;
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: req.query.code
    })
  });
  const tokenPayload = await tokenResponse.json();

  res.setHeader("Set-Cookie", [
    "kyoken_cms_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
  ]);

  if (!tokenPayload.access_token) {
    res.status(400).send(oauthResultPage("github", "error", tokenPayload));
    return;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(oauthResultPage("github", "success", { token: tokenPayload.access_token }));
}
