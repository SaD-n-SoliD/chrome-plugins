console.log('universal manga flipping hotkey extension is working!');
console.log('<- -> to flip through chapters');
console.log('[Insert] then [<-] or [->] then [click] to prev/next button to save hotkey');
let lastKey, newNextBtnState, newPrevBtnState, timeout
const hostname = document.location.hostname
const storage = chrome.storage.local
document.addEventListener('keydown', (e) => {
	// console.log(e);
	if (e.ctrlKey || e.shiftKey || e.altKey || e.code == lastKey) return
	if (e.code == 'Insert') e.preventDefault()
	else if (lastKey == 'Insert') {
		if (e.code == 'ArrowLeft') {
			newPrevBtnState = true
			newNextBtnState = false
			clearTimeout(timeout)
			timeout = setTimeout(() => { newPrevBtnState = false }, 10000);
		} else if (e.code == 'ArrowRight') {
			newNextBtnState = true
			newPrevBtnState = false
			clearTimeout(timeout)
			timeout = setTimeout(() => { newNextBtnState = false }, 10000);
		}
	}
	lastKey = e.code
})
document.addEventListener('click', async (e) => {
	if (!newNextBtnState && !newPrevBtnState) return
	e.preventDefault()
	let prev, next
	if (newNextBtnState) {
		next = getElementImage(e.target)
	} else if (newPrevBtnState) {
		prev = getElementImage(e.target)
	}
	let curr = (await storage.get([hostname]))[hostname] || {}
	console.log('new', { prev: prev || curr.prev, next: next || curr.next });
	await storage.set({
		[hostname]:
			{ prev: prev || curr.prev, next: next || curr.next }
	})
	newNextBtnState = newPrevBtnState = false
	clearTimeout(timeout)
})
document.addEventListener('keydown', addHotkeys)

function clickBtn(btn) {
	btn.dispatchEvent(new Event('click', { bubbles: true }))
}
function getElementImage(el) {
	let selector = [...el.attributes].reduce((acc, attr) => acc + `[*|${attr.name}="${attr.value}"]`,
		el.tagName)
	return ({ selector, innerHTML: el.innerHTML })
}
function getElementByImage(image) {
	let el = [...document.querySelectorAll(image.selector)]
		.filter(el => el.innerHTML === image.innerHTML)[0]
	console.log('elByImage ', image.selector, el);
	return el
}
async function addHotkeys(e) {
	if (e.ctrlKey || e.shiftKey || e.altKey || !['ArrowLeft', 'ArrowRight'].includes(e.code) || newPrevBtnState || newNextBtnState) return
	let { prev, next } = (await storage.get([hostname]))[hostname] || {}
	console.log('using hotkey', prev, next);
	if (!next) return

	switch (e.code) {
		case 'ArrowLeft':
			clickBtn(getElementByImage(prev))
			break
		case 'ArrowRight':
			clickBtn(getElementByImage(next))
			break
		default:
			break
	}
}

