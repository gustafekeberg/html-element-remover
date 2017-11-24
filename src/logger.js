module.exports = {
	logger: function (msg) {
		logger(msg);
	}
}

const _browser = require('extensionizer')

function logger(msg) {
	var extensionName = _browser.i18n.getMessage("extensionName")
	let stringified = JSON.stringify(msg, null, 4)
	console.log(`[${extensionName}]: ${stringified}`)
}