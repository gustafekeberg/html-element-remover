function createContextMenu(config) {
  logger("Creating context menu items")
  var menuItems = config.items
  var sigremLib = './lib/sigrem-lib/remove-signature.js'

  function prefix(id = '') {
    let preFixed = `${browser.i18n.getMessage("extensionName")}_${id}`
    return preFixed
  }
  function dePrefix(id) {
    let len = prefix().length
    let dePreFixed = id.slice(len, id.length)
    return dePreFixed
  }
  menuItems.forEach(item => {
    let id = prefix(item.menuID)
    let name = item.menuName

    logger(`Menuitem [${id}] created`)
    browser.contextMenus.create({
      id: id,
      title: name
    })
  })

  browser.contextMenus.onClicked.addListener(function (info, tab) {
    let menuID = dePrefix(info.menuItemId)

    var menuConfig = filterObj("menuID", menuID, config.items)

    var menuConfString = JSON.stringify(menuConfig, null, 4)
    logger(`menu item [${menuConfig[0].menuID}] clicked`)

    var configItems = config.items
    // browser.tabs.executeScript({})
    // if (info.menuItemId == "remove-lines") {
    //   browser.tabs.executeScript({
    //     file: sigremLib
    //   })
    // }
  })
}

function filterObj(key, value, jsonArray) {
  var result = jsonArray.filter(function (obj) {
    return obj[key] == value
  })
  return result
}

function onError(error) {
  logger(`Error: ${error}`)
}

function onGot(item) {
  var json = {}
  if (item.json) {
    json = JSON.parse(item.json)
  }
  createContextMenu(json)
}

var getting = browser.storage.local.get("json")
getting.then(onGot, onError)

function logger(msg) {
  var extensionName = browser.i18n.getMessage("extensionName")
  console.log(`[${extensionName}]: ${msg}`)
}