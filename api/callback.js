function getCookie(req, name) {
  const cookies = String(req.headers.cookie || "").split(";").map((item) => item.trim());
  const target = cookies.find((item) => item.startsWith(`${name}=`));
  return target ? decodeURIComponent(target.slice(name.length + 1)) : "";
}

function oauthResultPage(provider, status, payload) {
  const message = `authorization:${provider}:${status}:${JSON.stringify(payload)}`;
  const token = status === "success" && payload && payload.token ? payload.token : "";
  return `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Kyoken Admin Login</title></head>
<body>
<script>
(function () {
  var token = ${JSON.stringify(token)};
  var tokenKey = "kyoken_supply_admin_token";
  var adminPath = "/admin/";
  function receiveMessage(event) {
    if (!event || !event.origin) return;
    window.opener.postMessage(${JSON.stringify(message)}, event.origin);
    window.close();
  }
  if (window.opener) {
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
    return;
  }
  if (token) {
    try {
      window.sessionStorage.setItem(tokenKey, token);
    } catch (error) {}
    window.location.replace(adminPath);
    return;
  }
  document.body.textContent = "GitHub login failed. Please return to admin and try again.";
})();
</script>
<p>Authentication complete. Returning to admin...</p>
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

  const expectedState = getCookie(req, "kyoken_supply_oauth_state");
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
    "kyoken_supply_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
  ]);

  if (!tokenPayload.access_token) {
    res.status(400).send(oauthResultPage("github", "error", tokenPayload));
    return;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(oauthResultPage("github", "success", { token: tokenPayload.access_token }));
}
