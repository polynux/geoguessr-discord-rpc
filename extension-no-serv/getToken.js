let token = localStorage.getItem("token");

token = token.slice(1, token.length - 1);

if (token && token !== null) {
  chrome.storage.local.set({ token }, function () {
    alert("Token of your Discord account is ready. This token will used until expired.");
  });
}
