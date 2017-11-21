function saveOptions(e) {
	e.preventDefault()
	browser.storage.local.set({
		json: document.querySelector("#json").value
	})
}

function restoreOptions() {

	function setCurrentChoice(result) {
		document.querySelector("#json").value = result.json ||
`{
	"items": [
		{
			"menuName": "Select som p-elements",
			"menuID": "select-p",
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
		console.log(`Error: ${error}`)
	}

	var getting = browser.storage.local.get("json")
	getting.then(setCurrentChoice, onError)
}

document.addEventListener("DOMContentLoaded", restoreOptions)
document.querySelector("form").addEventListener("submit", saveOptions)