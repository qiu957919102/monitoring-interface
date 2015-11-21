requirejs(['sidebar', 'activity'], function (SideBar, Activity) {
	var Layout = React.createClass({
		_wsMessageHandlers: {},
		_deferredMessages: [],
		_wsOpened: false,

		getInitialState: function() {
			return { activeTab: 'activity' };
		},

		componentDidMount: function () {
			this._ws = new WebSocket('ws://' + location.hostname + ':8082');

			this._ws.onclose = function (event) {
				this._wsOpened = false;

				if (!event.wasClean) {
					alert('WebSocket connection has been closed abnormally [' + event.code + ']: ' + event.reason);
				}
			};

			this._ws.onerror = function (error) {
			  alert('WebSocket error: ' + error.message);
			};

			this._ws.onmessage = this._onWsMessage;

			this._ws.onopen = function () {
				this._wsOpened = true;
				this._sendDeferredMessages();
			}.bind(this);
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
			}

			return (
				<div>
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
