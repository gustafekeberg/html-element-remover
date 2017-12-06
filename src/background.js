const _browser = require('extensionizer')
const remover = './assets/remover.js'
const {
  logger
} = require('./logger')
const extensionVarName = _browser.i18n.getMessage("extensionName").split(' ').join('-').toLowerCase()
const CSSClasses = {
  tagName: extensionVarName,
  tagDelete: `${extensionVarName}-delete`,
  tagHide: `${extensionVarName}-hide`
}

function createContextMenu(config) {
  logger(`creating context menu items`)
  var menuItems = config.items
  createMenuItems(menuItems)
  createMenuItemSeparator()
  createMenuItemUndo()

  _browser.contextMenus.onClicked.addListener(function (info, tab) {
    let clickedIndex = dePrefix(info.menuItemId)

    if (clickedIndex !== config.items.length || clickedIndex !== config.items.length - 1) { // Run if not second last or not last

      let clickedConfig = config.items[clickedIndex]
      logger(`menu item [${clickedConfig.name}] clicked`)
      addStyle()
      executeScript(clickedConfig)
      
    } else if (clickedConfig == config.items.length) { // Index of separator and undo is at second last and last
      clickedConfig = 'config that removes changes goes here'
      executeScript(clickedConfig)

    }
  })
}

function executeScript(clickedConfig) {
  _browser.tabs.executeScript(tab.id, {
      code: `var config = ${JSON.stringify(clickedConfig)}, extensionName = '${extensionVarName}', CSSClasses = ${JSON.stringify(CSSClasses)}` // make config available to lib
    },
    function () {
      _browser.tabs.executeScript(tab.id, {
        file: remover
      })
    })
}

function createMenuItemSeparator() {
  _browser.contextMenus.create({
    id: prefix("separator"),
    type: "separator"
  })
}

function createMenuItemUndo() {
  _browser.contextMenus.create({
    id: prefix("undo"),
    title: "Undo (remove all hidden elements)"
  })
}

function createMenuItems(menuItems) {
  menuItems.forEach((item, index) => {
    let id = prefix(index)
    let name = item.name

    logger(`menuitem [${name}] created`)
    _browser.contextMenus.create({
      id: id,
      title: name
    })
  })
}

function addStyle() {
  var CSS =
    `
    .${CSSClasses.tagName} {
      opacity: 1
    }
    .${CSSClasses.tagHide} {
      opacity: 0;
      transition: all 500ms
    }
    `
  var insertingCSS = _browser.tabs.insertCSS({
    code: CSS
  })
  insertingCSS.then(null, onError())
}

function prefix(id = '') {
  let preFixed = `${extensionVarName}_${id}`
  return preFixed
}

function dePrefix(id) {
  let len = prefix().length
  let dePreFixed = id.slice(len, id.length)
  return dePreFixed
}

function onError(error) {
  logger(`error: ${error}`)
}

function onGot(item) {
  var json = {}
  if (item.json) {
    json = JSON.parse(item.json)
  }
  createContextMenu(json)
}

logger(`reading config`)
var getting = _browser.storage.local.get({
  json: {}
}, function (data, error) {
  if (data)
    onGot(data)
  else
    onError(error)
})