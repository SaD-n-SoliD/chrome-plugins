console.log('universal manga flipping hotkey extension is working!');
console.log('<- -> to flip through chapters');
console.log('[Insert] then [<-] or [->] then [click] to prev/next button to save hotkey');
console.log('use [rightClick] instead of [click] if you want to flip back using browser history');
let lastKey, newNextBtnState, newPrevBtnState, timeout
const hostname = document.location.hostname
const storage = chrome.storage.local
document.addEventListener('keydown', (e) => {
	// console.log(e);
	if (e.ctrlKey || e.shiftKey || e.altKey || e.code == lastKey) return
	if (e.code == 'Insert') e.preventDefault()
	else if (lastKey == 'Insert') {
		if (e.code == 'ArrowLeft') {
			e.preventDefault()
			newPrevBtnState = true
			newNextBtnState = false
			clearTimeout(timeout)
			timeout = setTimeout(() => { newPrevBtnState = false }, 10000);
		} else if (e.code == 'ArrowRight') {
			e.preventDefault()
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
	let prev, next, browserPrev
	let curr = (await storage.get([hostname]))[hostname] || {}
	if (newNextBtnState) {
		prev = curr.prev
		next = getElementImage(e.target)
		browserPrev = curr.browserPrev
	} else if (newPrevBtnState) {
		prev = getElementImage(e.target)
		next = curr.next
		browserPrev = false
	}
	console.log('new', { prev, next, browserPrev });
	await storage.set({
		[hostname]: { prev, next, browserPrev }
	})
	newNextBtnState = newPrevBtnState = false
	clearTimeout(timeout)
})
document.addEventListener('keydown', addHotkeys)
window.addEventListener('contextmenu', async (e) => {
	if (!newPrevBtnState) return
	e.preventDefault()
	let curr = (await storage.get([hostname]))[hostname] || {}
	await storage.set({
		[hostname]: { ...curr, browserPrev: true }
	})
	newNextBtnState = newPrevBtnState = false
	clearTimeout(timeout)
});

function clickBtn(btn) {
	// ох..фигеть - не встать. в некоторых местах это сработает только если создать не Event а именно MouseEvent. не говоря уже о том, что без { bubbles: true } событие не будет всплывать
	btn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}
function mkAttrSelector(attr) {
	let ignoredAttrs = ['href']
	return ignoredAttrs.includes(attr.name) ? `[*|${attr.name}]` : `[*|${attr.name}="${attr.value}"]`
}
function getElementImage(el) {
	let selector = [...el.attributes].reduce((acc, attr) => acc + mkAttrSelector(attr),
		el.tagName)
	return ({ selector, innerHTML: el.innerHTML })
}
function getElementByImage(image) {
	let el = [...document.querySelectorAll(image.selector)]
		.filter(el => el.innerHTML === image.innerHTML)[0]
	console.log('elByImage ', image.selector, el);
	return el
}
function moveToPrevChapter(image, browserPrev) {
	browserPrev ? history.back() : clickBtn(getElementByImage(image))
}
async function addHotkeys(e) {
	if (e.ctrlKey || e.shiftKey || e.altKey || !['ArrowLeft', 'ArrowRight'].includes(e.code) || newPrevBtnState || newNextBtnState) return
	let { prev, next, browserPrev } = (await storage.get([hostname]))[hostname] || {}
	console.log('using hotkey', prev, next);
	if (!next && !prev) return

	switch (e.code) {
		case 'ArrowLeft':
			moveToPrevChapter(prev, browserPrev)
			break
		case 'ArrowRight':
			clickBtn(getElementByImage(next))
			break
		default:
			break
	}
}

