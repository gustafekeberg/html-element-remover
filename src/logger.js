const _browser = require('extensionizer')
const extensionVarName = _browser.i18n.getMessage("extensionName").split(' ').join('-').toLowerCase()

module.exports = {
	logger: function (msg) {
		logger(msg);
	}
}


function logger(msg) {
	var extensionName = extensionVarName
	let stringified = JSON.stringify(msg, null, 4)
	console.log(`[${extensionName}]: ${stringified}`)
}