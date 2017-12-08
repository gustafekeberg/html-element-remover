function log(msg) {
	let formattedMsg = `[${extensionName}] ${JSON.stringify(msg, null, 4)}`
	console.log(formattedMsg)
}

function processQuery(params) {
	log('processQuery')
	let queries = params.query
	queries.forEach(item => {
		let elements = document.querySelectorAll(item.selector)
		tagElements(elements, item)
	})
}

function tagElements(elements, par) {
	log('tagElements')
	elements.forEach(element => {
		if ((par.innerHTML || par.innerText) && (par.innerHTML == element.innerHTML || par.innerText == element.innerText))
			addClass(element, par)
		else if (!par.innerHTML && !par.innerText)
			addClass(element, par)
	})
}

function delMarkedElements() {
	log(`delMarkedElements`)
	let el = `.${CSSClasses.tagDelete}`
	while (getEl(el)) {
		delEl(getEl(el))
	}
}

function undo(config) {
	log(`undoing changes`)
	for (var key in CSSClasses)
	{
		let CSSClass = CSSClasses[key]
		let el = `.${CSSClass}`
		while (getEl(el)) {
			delClass(CSSClass, getEl(el))
		}
	}
}

function getEl(el) {
	return document.querySelector(el);
}

function delEl(el) {
	el.parentNode.removeChild(el)
}

function delClass(CSSClass, el) {
	el.classList.remove(CSSClass)
}

function addClass(element, par) {
	log(`addClass`)
	element.classList.add(CSSClasses.tagName)
	if (par.delete)
		element.classList.add(CSSClasses.tagDelete)
	else if (par.remove)
		element.classList.add(CSSClasses.tagRemove)
	else if (par.preview !== true)
		element.classList.add(CSSClasses.tagHide)
}

function performAction(config) {
	let action = config.action
	switch (action) {
		case 'print':
			window.print()
			break;
		default:
			action = 'no action'
			break
	}
	log(`performAction [${action}]`)
}

if (config.undo)
	undo(config.params)
else {
	processQuery(config.params)
	delMarkedElements()
	performAction(config.params)
}