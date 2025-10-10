function toast({ title = '', message = '', type = 'info', duration = 3000 }) {
	const main = document.querySelector('#toast');
	if (main) {
		const toast = document.createElement('div');

		const autoRmId = setTimeout(() => {
			main.removeChild(toast);
		}, duration + 1000);

		toast.onclick = (e) => {
			if (e.target.closest('.toast__close')) {
				main.removeChild(toast);
				clearTimeout(autoRmId);
			}
		};
		const icons = {
			success: 'fa fa-check-circle',
			error: 'fa fa-warning',
			warning: 'fa fa-exclamation-circle',
			info: 'fa fa-info-circle',
		};
		const icon = icons[type];
		const delay = (duration / 1000).toFixed(2);
		toast.classList.add('toast', `toast--${type}`);
		toast.style.animation = ` slideInLeft linear 0.3s, fadeOut linear 1s ${delay}s forwards`;
		toast.innerHTML = `
            <div class="toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__msg">${message}</p>
            </div>
            <div class="toast__close">
                <i class="fas fa-times-circle"></i>
            </div>
        `;
		main.appendChild(toast);
	}
}
