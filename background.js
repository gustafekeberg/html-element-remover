const _browser = (setBrowser() === 'chrome') ? chrome : browser
const browserType = setBrowser()
logger(browserType)

function createContextMenu(config) {
  logger("Creating context menu items")
  var menuItems = config.items
  var sigremLib = './lib/sigrem-lib/remove-signature.js'

  function prefix(id = '') {
    let preFixed = `${_browser.i18n.getMessage("extensionName")}_${id}`
    return preFixed
  }

  function dePrefix(id) {
    let len = prefix().length
    let dePreFixed = id.slice(len, id.length)
    return dePreFixed
  }
  menuItems.forEach((item, index) => {
    let id = prefix(index)
    let name = item.name

    logger(`Menuitem [${id}] created`)
    _browser.contextMenus.create({
      id: id,
      title: name
    })
  })

  _browser.contextMenus.onClicked.addListener(function (info, tab) {
    let clickedIndex = dePrefix(info.menuItemId)
    let clickedConfig = config.items[clickedIndex]
    logger(`menu item [${clickedConfig.name}] clicked`)

    _browser.tabs.executeScript(tab.id, {
        code: `var config = ${JSON.stringify(clickedConfig)}` // make config available to lib
      },
      function () {
        _browser.tabs.executeScript(tab.id, {
          file: sigremLib
        })
      })
  })
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

var getting = _browser.storage.local.get({json: {}}, function (data, error) {
  if (data)
    onGot(data)
  else
    onError(error)
})

function logger(msg) {
  var extensionName = _browser.i18n.getMessage("extensionName")
  let stringified = JSON.stringify(msg, null, 4)
  console.log(`[${extensionName}]: ${stringified}`)
}

function setBrowser() {
  if (typeof browser !== 'undefined')
    return 'browser'
  else
    return 'chrome'
}
