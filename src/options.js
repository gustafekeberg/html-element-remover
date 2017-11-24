function setBrowser() {
	if (typeof browser !== 'undefined')
		return 'browser'
	else
		return 'chrome'
}
const _browser = (setBrowser() === 'chrome') ? chrome : browser
// const browserType = setBrowser()
// const _browser = require('extensionizer')

function saveOptions(e) {
	e.preventDefault()
	_browser.storage.local.set({
		json: document.querySelector("#json").value
	}, function () {
		logger(`writing to browser storage`)
	})
}

function restoreOptions() {

	function setCurrentChoice(result) {
		document.querySelector("#json").value = result.json ||
			`{
	"items": [
		{
			"menuName": "Select som p-elements",
			"query": [
				{
					"selector": "",
					"innerHtml": "",
					"innerText": "Sample text"
				}
			]
		}
	]
}`
	}

	function onError(error) {
		logger(`Error: ${error}`)
	}
	var defaultData = `{
			"items": [
				{
					"name": "Select som p-elements",
					"query": [
						{
							"selector": "",
							"innerHtml": "",
							"innerText": "Sample text"
						}
					]
				}
			]
		}`
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

function logger(msg) {
	var extensionName = _browser.i18n.getMessage("extensionName")
	let stringified = JSON.stringify(msg, null, 4)
	console.log(`[${extensionName}]: ${stringified}`)
}