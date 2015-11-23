define(function() {
	var Tabs = React.createClass({
		getInitialState: function () {
			return { tab: 'finished' };
		},

		selectFinishedTab: function () {
			this.setState({ tab: 'finished' });
			this.props.history.setActiveTab('finished');
		},

		selectFailedTab: function () {
			this.setState({ tab: 'failed' });
			this.props.history.setActiveTab('failed');
		},

		selectTimedOutTab: function () {
			this.setState({ tab: 'timedOut' });
			this.props.history.setActiveTab('timedOut');
		},

		render: function () {
			var
				isFinishedSelected = this.state.tab == 'finished',
				isFailedSelected = this.state.tab == 'failed',
				isTimedOutSelected = this.state.tab = 'timedOut'
			;

			return (
				<div className="buttongroup">
					<button type="button" data-selected="false" className="transparent-button first" onClick={this.selectFinishedTab}>Finished</button>
					<button type="button" data-selected="false" className="transparent-button" onClick={this.selectFailedTab}>Failed</button>
					<button type="button" data-selected="false" className="transparent-button last" onClick={this.selectTimedOutTab}>Timed out</button>
				</div>
			);
		}
	});

	var HistoryItem = React.createClass({
		render: function () {
			var whatIsIt;

			switch (this.props.item.profileId) {
				case 2:
					whatIsIt = 'Content';
				break;

				case 4:
					whatIsIt = 'Upload';
				break;

				default:
					whatIsIt = '[Unknown]';
			}

			var
				size = this.props.layout._normalizeSize(this.props.item.size);
				started = new Date(this.props.item.started).toLocaleString(),
				updated = new Date(this.props.item.updated).toLocaleString()
			;

			return (
				<tr data-selected="false">
					<td>{this.props.item.filename}</td>
					<td>{whatIsIt}</td>
					<td>{size}</td>
					<td>{started}</td>
					<td>{updated}</td>
				</tr>
			);
		}
	});

	var History = React.createClass({
		render: function () {
			var history = this.props.items.map(function (item) {
				return (
					<HistoryItem layout={this.props.layout} item={item} />
				);
			}.bind(this));

			return (
				<div className="table">
					<table id="table-history">
						<thead>
							<tr>
								<th>File Name</th>
								<th>What Is It</th>
								<th>Size</th>
								<th>Started</th>
								<th>Finished</th>
							</tr>
						</thead>

						<tbody>
							{history}
						</tbody>
					</table>
				</div>
			);
		}
	});

	return React.createClass({
		_wsMessageHandlerId: null,
		_isFirstWsMessage: true,
		_activeTab: 'finished',

		getInitialState: function() {
			return { history: [] };
		},

		setActiveTab: function (activeTab) {
			this._activeTab = activeTab;
			this._sendMessage();
		},

		_wsMessageHandler: function (data) {
			if (this._isFirstWsMessage) {
				this.props.layout.hideLoader();
				this._isFirstWsMessage = false;
			}

			this.setState({ history: data });
			setTimeout(this._sendMessage.bind(this), 5000);
		},

		_sendMessage: function () {
			this.props.layout.sendWsMessage('history', { status: this._activeTab });
		},

		_handleWsMessage: function () {
			this._wsMessageHandlerId = this.props.layout.handleWsMessage('history', this._wsMessageHandler);
		},

		componentWillMount: function () {
			this._handleWsMessage();
			this.props.layout.sendWsMessage('history', { status: this._activeTab });
		},

		componentWillUnmount: function () {
			this.props.layout.removeWsMessageHandler('history', this._wsMessageHandlerId);
			this.props.layout.showLoader();
		},

		render: function () {
			return (
				<div id="history-page" className="history">
					<Tabs history={this} />
					<History items={this.state.history} layout={this.props.layout} />
				</div>
			);
		}
	});
});
