browser.contextMenus.create({
  id: "remove-lines",
  title: "Remove signature lines"
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "remove-lines") {
    browser.tabs.executeScript({
      file: "remove-signature.js"
    });
  }
});