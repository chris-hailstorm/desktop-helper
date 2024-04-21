const tabs = await chrome.tabs.query({});
const tabsSelectDom = document.getElementById("tabs");
const serverDom = document.getElementById("server");
const tokenDom = document.getElementById("token");
const okDom = document.getElementById("ok");

const textToMatch = "KONA ICE";
const matchViaText = false;

if (matchViaText) {
  for (const tab of tabs) {
    //
    // user confusion if >1 "Kona Ice" tabs
    //
    if (tabsSelectDom.title == textToMatch) {
      console.log("Setting " + JSON.stringify(tab));
      let option = document.createElement("option");
      option.text = tab.title;
      option.value = tab.id;
      option.selected = "selected";
      tabsSelectDom.add(option);
      break;
    }
  }
} else {
  // see https://stackoverflow.com/a/39840655/763269
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const tab = tabs[0];
    console.log("tab: " + JSON.stringify(tab));
    if (tab) {
        let option = document.createElement("option");
        option.text = tab.title;
        option.value = tab.id;
        option.selected = "selected";
        tabsSelectDom.add(option);
      }
  });
}

const localServer = localStorage.getItem("server");
const localToken = localStorage.getItem("token");

if (localServer) {
  serverDom.value = localServer;
}

if (localToken) {
  tokenDom.value = localToken;
}

serverDom.addEventListener("change", (e) => {
  const serverDom = document.getElementById("server");
  const server = serverDom.value;
  localStorage.setItem("server", server);
});

tokenDom.addEventListener("change", (e) => {
  const tokenDom = document.getElementById("token");
  const token = tokenDom.value;
  localStorage.setItem("token", token);
});

tabsSelectDom.addEventListener("change", (e) => {
  const serverDom = document.getElementById("server");
  const tokenDom = document.getElementById("token");
  const server = serverDom.value;
  const token = tokenDom.value;
  (async () => {
    const response = await chrome.runtime.sendMessage({
      id: e.target.value,
      server: server,
      token: token,
    });
  })();
});

// see https://stackoverflow.com/a/60661665/763269
okDom.addEventListener("click", (e) => {
  console.log("click");
  const tabsSelectDom = document.getElementById("tabs");
  tabsSelectDom.dispatchEvent(new Event("change", { bubbles: true }));
});
