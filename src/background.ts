function openPopUp() {
  chrome.tabs.executeScript(
    {
      file: "/js/getSelection.js"
    },
    function([url]) {
      var width = 560;
      var height = 620;

      chrome.windows.create({
        url,
        type: "popup",
        width,
        height
      });
    }
  );
}

chrome.browserAction.onClicked.addListener(tab => {
  openPopUp();
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-phrasebook",
    title: "Add to Phrasebook",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add-phrasebook") {
    openPopUp();
  }
});
