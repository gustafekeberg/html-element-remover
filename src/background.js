const _browser = require('extensionizer')
const remover = './assets/remover.js'
const { logger } = require('./logger')
const extensionVarName = _browser.i18n.getMessage("extensionName").split(' ').join('-').toLowerCase()

function createContextMenu(config) {
  logger("Creating context menu items")
  var menuItems = config.items
  
  function prefix(id = '') {
    let preFixed = `${extensionVarName}_${id}`
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
      code: `var config = ${JSON.stringify(clickedConfig)}, extensionName = '${extensionVarName}'` // make config available to lib
      },
      function () {
        _browser.tabs.executeScript(tab.id, {
          file: remover
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
    logger(json)
  }
  createContextMenu(json)
}

logger("Getting data")
var getting = _browser.storage.local.get({json: {}}, function (data, error) {
  if (data)
    onGot(data)
  else
    onError(error)
})
