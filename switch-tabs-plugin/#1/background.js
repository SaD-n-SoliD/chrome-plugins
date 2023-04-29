const myCommands = {
	'select-vk': selectTabFn('https://vk.com/*'),
	'select-youtube': selectTabFn('https://www.youtube.com/*'),
	'select-translator': selectTabFn(['https://translate.google.com/*', 'https://translate.yandex.ru/*']),
	'select-calculator': selectTabFn('https://www.google.com/*', '*калькулятор*'),
	'select-soundcloud': selectTabFn('https://soundcloud.com/*'),
	'select-mail': selectTabFn('https://mail.yandex.ru/*'),
	'open-tab-right': openTabRight,
}
chrome.commands.onCommand.addListener((command) => {
	// console.log(command);
	myCommands[command]()
});
async function getTab(url, title) {
	let queryOptions = { url, title, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab
}
async function highlightTab(tab) {
	// console.log(tab);
	let highlightInfo = { tabs: [tab.index] };
	await chrome.tabs.highlight(highlightInfo);
}
function selectTabFn(url, title) {
	return async function () {
		const tab = await getTab(url, title);
		await highlightTab(tab)
	}
}
async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}
async function openTabRight() {
	const currTab = await getCurrentTab();
	await chrome.tabs.create({ openerTabId: currTab.id, index: currTab.index + 1 })
}