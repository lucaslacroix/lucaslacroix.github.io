const Emitter = {
	events: {},

	on(event, cb) {
		Emitter.events[event] = Emitter.events[event] || [];
		Emitter.events[event].push(cb);
	},

	emit(event, ...rest) {
		if (event in Emitter.events === false) return;

		Emitter.events[event].forEach((e) => {
			e(...rest);
		});
	},
};

const View = {
	view: null,

	render(viewId, { bgColor, color, notice, showTimer }) {
		View.view = viewId;

		document.querySelector(viewId).innerHTML = `
			<div
                class="timed-notice-container"
                style="${
									bgColor ? `--notice-background-color: ${bgColor};` : ''
								} ${color ? `--notice-color: ${color};` : ''}"
            >
                <div class="notice-container">
                    ${notice}
                </div>
                ${showTimer ? `<div class="countdown-container"></div>` : ''}
            </div>
        `;
	},

	destroy() {
		document.querySelector(View.view).innerHTML = ``;
	},

	setViewEvents() {
		const { container, showNotice, hideNotice } = this.timedNoticeContainer();
		container.addEventListener('mouseover', () => showNotice());
		container.addEventListener('mouseout', () => hideNotice());
	},

	getCountDownContainer() {
		return document.querySelector(`${View.view} .countdown-container`);
	},

	timedNoticeContainer() {
		const timedNotice = document.querySelector(
			`${View.view} > .timed-notice-container`,
		);
		return {
			container: timedNotice,
			showNotice() {
				timedNotice.classList.add('timed-show-notice');
			},
			hideNotice() {
				timedNotice.classList.remove('timed-show-notice');
			},
		};
	},
};

const Timer = {
	endDate: null,
	interval: null,

	init(endDate) {
		Timer.endDate = new Date(endDate);

		if (Timer.endDate > new Date()) {
			Emitter.emit('startTimer');
			Timer.interval = setInterval(Timer.countdown, 1000);
		} else {
			Emitter.emit('clearTimer');
		}
	},

	format: (time) => String(time).padStart(2, '0'),

	countdown() {
		const diffDates = Timer.endDate - new Date();
		const diffSeconds = diffDates / 1000;

		const days = Math.floor(diffSeconds / 60 / 60 / 24);
		const hour = Math.floor(diffSeconds / 60 / 60) % 24;
		const min = Math.floor(diffSeconds / 60) % 60;
		const sec = Math.floor(diffSeconds) % 60;

		Emitter.emit(
			'updateTimer',
			`${days > 0 ? `${days} ` : ''}${Timer.format(hour)}:${Timer.format(
				min,
			)}:${Timer.format(sec)}`,
		);

		if (Math.floor(diffSeconds) <= 0) {
			Emitter.emit('stopTimer');
			clearInterval(Timer.interval);
			return;
		}
	},
};

// Timer.init('2021-07-26T23:10'); { bgColor, color, notice, endDate }

function TimedNotice({ bgColor, color, notice, endDate, showTimer }) {
	let countdownContainer = null;
	Emitter.on('startTimer', () => {
		View.render('#timed-notice', {
			bgColor,
			color,
			notice,
			showTimer,
		});

		View.setViewEvents();

		countdownContainer = View.getCountDownContainer();
	});

	Emitter.on('stopTimer', () => View.destroy());

	if (showTimer) {
		Emitter.on(
			'updateTimer',
			(countdown) => (countdownContainer.innerHTML = countdown),
		);
	}
	Timer.init(endDate);
}

TimedNotice({
	notice: `
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
    `,
	endDate: nextDay(),
	showTimer: true,
	bgColor: '#ff6659',
	color: '#000',
});

function nextDay() {
	const data = new Date();
	data.setDate(data.getDate() + 1);
	return data.getTime();
}
