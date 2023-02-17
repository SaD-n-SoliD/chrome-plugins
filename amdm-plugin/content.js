console.log('AmDm hotkey extension is working!');
console.log('< > to set scroll speed');
console.log('- + to set font size');
(() => {
	const plusFS = document.querySelector('.b-fontsize .fa-plus').parentElement;
	const minusFS = document.querySelector('.b-fontsize .fa-minus').parentElement;
	const plusSpeed = document.querySelector('.b-scroll .fa-plus').parentElement;
	const minusSpeed = document.querySelector('.b-scroll .fa-minus').parentElement;

	function clickBtn(btn) {
		btn.dispatchEvent(new Event('click', { bubbles: true }))
	}
	document.addEventListener('keydown', function (e) {
		// console.log(e);
		if (e.ctrlKey || e.shiftKey) return;
		switch (e.code) {
			case 'Comma':
				clickBtn(minusSpeed);
				break;
			case 'Period':
				clickBtn(plusSpeed);
				break;
			case 'Minus':
				clickBtn(minusFS);
				break;
			case 'Equal':
				clickBtn(plusFS);
				break;

			default:
				break;
		}
	});
}).call();
