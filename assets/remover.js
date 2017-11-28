function log(msg) {
	let formattedMsg = `[${extensionName}] ${JSON.stringify(msg, null, 4)}`
	console.log(formattedMsg)
}

function processQuery(config) {
	log('processQuery')
	let queries = config.query
	queries.forEach(item => {
		let elements = document.querySelectorAll(item.selector)
		tagElements(elements, item)
	})
}

function tagElements(elements, par) {
	log('tagElements')
	elements.forEach(element => {
		if ((par.innerHTML || par.innerText) && (par.innerHTML == element.innerHTML || par.innerText == element.innerText) )
			addClass(element, par)
		else if (!par.innerHTML && !par.innerText)
			addClass(element, par)
	})
}

function delMarkedElements() {
	log(`delMarkedElements`)

	function getEl() {
		return document.querySelector(`.${CSSClasses.tagDelete}`);
	}

	function delEl(el) {
		el.parentNode.removeChild(el)
	}
	while (getEl()) {
		delEl(getEl())
	}
}

function addClass(element, par) {
	log(`addClass`)
	element.classList.add(CSSClasses.tagName)
	if (par.delete)
		element.classList.add(CSSClasses.tagDelete)
	else
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

processQuery(config)
delMarkedElements()
performAction(config)