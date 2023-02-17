const myCommands = {
	'select-vk': selectTabFn('https://vk.com/*'),
	'select-youtube': selectTabFn('https://www.youtube.com/*'),
	'select-translator': selectTabFn('https://www.google.com/*', '*переводчик*'),
	'select-calculator': selectTabFn('https://www.google.com/*', '*калькулятор*'),
	'select-soundcloud': selectTabFn('https://soundcloud.com/*'),
	'select-mail': selectTabFn('https://mail.yandex.ru/*'),
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