const tabs = await chrome.tabs.query({});
const tabsSelectDom = document.getElementById("tabs");
const serverDom = document.getElementById("server");
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

if (localServer) {
  serverDom.value = localServer;
}

serverDom.addEventListener("change", (e) => {
  const serverDom = document.getElementById("server");
  const server = serverDom.value;
  localStorage.setItem("server", server);
});

tabsSelectDom.addEventListener("change", (e) => {
  const serverDom = document.getElementById("server");
  const server = serverDom.value;
  (async () => {
    const response = await chrome.runtime.sendMessage({
      id: e.target.value,
      server: server,
    });
  })();
});

// see https://stackoverflow.com/a/60661665/763269
okDom.addEventListener("click", (e) => {
  console.log("click");
  const tabsSelectDom = document.getElementById("tabs");
  tabsSelectDom.dispatchEvent(new Event("change", { bubbles: true }));
});
