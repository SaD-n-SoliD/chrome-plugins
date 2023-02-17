document.body.addEventListener('keydown', (e) => {
	// console.log(e);
	if (e.code == 'KeyF') {
		const btn = document.querySelector('.control-bar-button--button--20ibv > .udi-expand, .control-bar-button--button--20ibv > .udi-collapse').parentElement;

		let event = new Event('click', {
			bubbles: true
		});
		btn.dispatchEvent(event);
		// console.log(btn);
	}
})