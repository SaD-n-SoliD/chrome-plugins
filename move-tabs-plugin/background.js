const myCommands = {
	'move-left': moveCurrentTab(-1),
	'move-right': moveCurrentTab(1)
}
// console.log('hi');
chrome.commands.onCommand.addListener((command) => {
	// console.log(command);
	myCommands[command]()
});
async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}
async function moveTab(tab, offset) {
	try {
		console.log(tab)
		await chrome.tabs.move(tab.id, { index: tab.index + offset });
		// console.log('Success.');
	} catch (error) {
		if (error == 'Error: Tabs cannot be edited right now (user may be dragging a tab).') {
			setTimeout(() => moveTab(tab, offset), 50);
		} else {
			console.error('ошибка перемещения вкладки:\n', error);
		}
	}
}
function moveCurrentTab(offset) {
	return async function () {
		const tab = await getCurrentTab()
		moveTab(tab, offset)
	}
}