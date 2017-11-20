var sigremLib = './lib/sigrem-lib/remove-signature.js'
var contextMenuItem = browser.i18n.getMessage("contextMenuItem");
browser.contextMenus.create({
  id: "remove-lines",
  title: contextMenuItem
});

browser.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId == "remove-lines") {
    browser.tabs.executeScript({
      file: sigremLib
    });
  }
});