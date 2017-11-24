const _browser = require('extensionizer')
const { logger } = require('./logger')
const defaultData =
`{
  "items": [{
    "name": "Select som p-elements",
    "query": [{
			"delete": false,
      "selector": "<enter html-selector>",
      "innerHTML": "Use innerHTML or",
      "innerText": "innerText"
    }]
  }]
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