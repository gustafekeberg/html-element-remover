const _browser = require('extensionizer')
const { logger } = require('./logger')
const defaultData =
`{
  "items": [{
      "name": "Select all <p> with 'innerText' sample text and delete from document",
      "query": [{
          "delete": true,
          "selector": "p",
          "innerText": "Sample text"
        },
        {
          "delete": true,
          "selector": "p",
          "innerHTML": "<b>HTML</b>"
        }
      ]
    },
    {
      "name": "Select css-class named 'css-class' and hide it from the document",
      "query": [{
        "selector": ".css-class"
      }]
    }
  ]
}`

function saveOptions(e) {
  e.preventDefault()
  _browser.storage.local.set({
    json: document.querySelector("#json").value
  }, function () {
    logger(`writing to browser storage`)
  })
  _browser.runtime.reload()
  logger(`reloading extension`)
}

function showDescription() {
  let description = _browser.i18n.getMessage("configDescription")
  let title = _browser.i18n.getMessage("configTitle")
  // console.log(description)
  let descriptionElement = document.getElementById("description")
  let html = `${title} ${description}`
  descriptionElement.innerHTML = html
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#json").value = result.json || defaultData
  }

  function onError(error) {
    logger(`error: ${error}`)
  }
  var getting = _browser.storage.local.get({
    json: defaultData
  }, function (data, error) {
    if (data)
      setCurrentChoice(data)
    else
      onError(error)
  })
}

document.addEventListener("DOMContentLoaded", restoreOptions)
document.querySelector("form").addEventListener("submit", saveOptions)
showDescription()