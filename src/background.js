const _browser = require('extensionizer')
const remover = './assets/remover.js'
const {
  logger
} = require('./logger')
const extensionVarName = _browser.i18n.getMessage("extensionName").split(' ').join('-').toLowerCase()
const CSSClasses = {
  tagName: extensionVarName,
  tagDelete: `${extensionVarName}-delete`,
  tagHide: `${extensionVarName}-hide`,
  tagRemove: `${extensionVarName}-remove`
}
const CSS =
`
.${CSSClasses.tagName} {
  outline: 2pt dashed #00aeff !important
}
.${CSSClasses.tagHide} {
  visibility: hidden !important
}
.${CSSClasses.tagRemove} {
  display: none !important
}
`
var cssInserted = false

function createContextMenu(config) {
  logger(`creating context menu items`)
  var menuItems = config.items
  createMenuItems(menuItems)
  if (config.undo)
    createMenuItemUndo()

  _browser.contextMenus.onClicked.addListener(function (info, tab) {
    var dePreFixed = dePrefix(info.menuItemId)
    if (dePreFixed == 'undo')
      executeScript({undo: true}, tab)
    else {
      let clickedIndex = dePreFixed
      let clickedConfig = config.items[clickedIndex]
      logger(`menu item [${clickedConfig.name}] clicked`)
      addStyle()
      executeScript(clickedConfig, tab)
    }
  })
}

function executeScript(clickedConfig, tab) {
  let config = {
    params: clickedConfig,
    undo: clickedConfig.undo == true ? true : false
  }
  _browser.tabs.executeScript(tab.id, {
      code: `var config = ${JSON.stringify(config)}, extensionName = '${extensionVarName}', CSSClasses = ${JSON.stringify(CSSClasses)}` // make config available to lib
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
  createMenuItemSeparator() // add separator before menu item is added
  _browser.contextMenus.create({
    id: prefix("undo"),
    title: "Undo changes"
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
  if (cssInserted == false)
  {
    var insertingCSS = _browser.tabs.insertCSS({
      code: CSS
    })
    insertingCSS.then(cssInserted = true, onError())
  }
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