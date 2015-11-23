requirejs(['sidebar', 'activity', 'history'], function (SideBar, Activity, History) {
	var Layout = React.createClass({
		_wsMessageHandlers: {},
		_deferredMessages: [],
		_wsOpened: false,
		_lastState: {},

		_normalizeSize: function (size, units) {
			if (!units) {
				units = ['B', 'KB', 'MB', 'GB'];
			}

			var curUnit = 0;

			while (size > 1000) {
				curUnit++;
				size = (size / 1000).toFixed(2);
			}

			return size + ' ' + units[curUnit];
		},

		_normalizeSpeed: function (speed) {
			return this._normalizeSize(speed * 8, ['bits', 'kbit/s', 'Mbit/s', 'Gbit/s' /* lol, Gbit/s */]);
		},

		_establishWsConnect: function () {
			this._ws = new WebSocket('ws://' + location.hostname + ':8082');

			this._ws.onclose = this._onWsConnectClose;
			this._ws.onerror = this._onWsConnectError;
			this._ws.onmessage = this._onWsMessage;
			this._ws.onopen = this._onWsConnectOpen;
		},

		_onWsConnectError: function () {
			setTimeout(this._establishWsConnect, 5000);
		},

		_onWsConnectClose: function () {
			if (!this._wsOpened) {
				return;
			}

			this._wsOpened = false;
			this._lastState.activeTab = this.state.activeTab;
			this.setState({ activeTab: '' });
			this.showLoader();

			setTimeout(function () {
				this._establishWsConnect();
			}.bind(this), 3000);
		},

		_onWsConnectOpen: function () {
			if (this._wsOpened) {
				return;
			}

			this._wsOpened = true;

			if (this._lastState.activeTab) {
				this.setState({ activeTab: this._lastState.activeTab });
			}

			this._sendDeferredMessages();
		},

		getInitialState: function() {
			return { activeTab: 'activity' };
		},

		componentDidMount: function () {
			this._establishWsConnect();
		},

		_switchLoader: function (isVisible) {
			document.getElementById('loader').style.display = isVisible ? 'table' : 'none';
		},

		showLoader: function () {
			this._switchLoader(true);
		},

		hideLoader: function () {
			this._switchLoader(false);
		},

		_onWsMessage: function (event) {
			var message = JSON.parse(event.data);

			if (!this._wsMessageHandlers[message.action]) {
				return;
			}

			this._wsMessageHandlers[message.action].forEach(function (handler) {
				handler(message.data);
			});
		},

		isWsOpened: function () {
			return this._wsOpened;
		},

		handleWsMessage: function (action, handler) {
			if (!this._wsMessageHandlers[action]) {
				this._wsMessageHandlers[action] = [];
			}

			this._wsMessageHandlers[action].push(handler);
			return this._wsMessageHandlers[action].length - 1;
		},

		removeWsMessageHandler: function (action, id) {
			delete this._wsMessageHandlers[action][id];
		},

		sendWsMessage: function (action, data) {
			if (!this._wsOpened) {
				this._deferredMessages.push({ action: action, data: data });
				return;
			}

			this._ws.send(JSON.stringify({ action: action, data: data }));
		},

		_sendDeferredMessages: function () {
			var message;

			while (message = this._deferredMessages.shift()) {
				this.sendWsMessage(message.action, message.data);
			}
		},

		selectActivityTab: function () {
			this.setState({ activeTab: 'activity' });
		},

		selectHistoryTab: function () {
			this.setState({ activeTab: 'history' });
		},

		selectStatisticsTab: function () {
			this.setState({ activeTab: 'statistics' });
		},

		render: function () {
			var content;

			switch (this.state.activeTab) {
				case 'activity':
					content = <Activity layout={this} />;
				break;

				case 'history':
					content = <History layout={this} />;
				break;

				case 'statistics':
					content = <Statistics layout={this} />;
				break;

				default:
					content = '';
			}

			return (
				<div className="wrapper2">
					<SideBar layout={this} activeTab={this.state.activeTab} />

					<div className="content">
						{content}
					</div>
				</div>
			);
		}
	});

	React.render(
		React.createElement(Layout, null),
		document.getElementById('wrapper')
	);
});
