var tagName = `${extensionName}`
var tagDelete = `${tagName}-remove`
var tagHide = `${tagName}-hide`

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
		if (par.innerHTML == element.innerHTML || par.innerText == element.innerText)
		addClass(element, par)
		else if (!par.innerHTML && !par.innerText) {
			addClass(element, par)
		}
	})
}

function delMarkedElements() {
	log('delMarkedElements')	
	function getEl(){
		return document.querySelector(`.${tagDelete}`);
	}
	function delEl(el) {
		el.parentNode.removeChild(el)
		log('element removed')
	}
	while (getEl())
	{
		delEl(getEl())
	}
}

function addClass(element, par) {
	log('addClass')
	log(par.delete)
	element.classList.add(tagName)
	if (par.delete)
		element.classList.add(tagDelete)
	else
		element.classList.add(tagHide)
}

function addStyleElement() {
	var CSS =
	`
	.${tagName} {
		opacity: 1
	}
	.${tagHide} {
		opacity: 0;
		transition: all 500ms
	}
	`

	var body = document.querySelector('body')
	var style = document.createElement('style')
	style.innerHTML = CSS
	body.appendChild(style)
}
addStyleElement()
processQuery(config)
delMarkedElements()