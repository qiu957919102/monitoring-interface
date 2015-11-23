define(function() {
	var Tabs = React.createClass({
		render: function () {
			return (
				<div className="buttongroup">
					<button type="button" data-selected="true" className="transparent-button first">All</button>
					<button type="button" data-selected="false" className="transparent-button">Normal</button>
					<button type="button" data-selected="false" className="transparent-button last">Errors</button>
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

		getInitialState: function() {
			return { history: [] };
		},

		_wsMessageHandler: function (data) {
			if (this._isFirstWsMessage) {
				this.props.layout.hideLoader();
				this._isFirstWsMessage = false;
			}

			this.setState({ history: data });
			setTimeout(this.props.layout.sendWsMessage.bind(this.props.layout, 'history', { status: 'finished' }), 5000);
		},

		_handleWsMessage: function () {
			this._wsMessageHandlerId = this.props.layout.handleWsMessage('history', this._wsMessageHandler);
		},

		componentWillMount: function () {
			this._handleWsMessage();
			this.props.layout.sendWsMessage('history', { status: 'finished' });
		},

		componentWillUnmount: function () {
			this.props.layout.removeWsMessageHandler('history', this._wsMessageHandlerId);
			this.props.layout.showLoader();
		},

		render: function () {
			return (
				<div id="history-page" className="history">
					<Tabs />
					<History items={this.state.history} layout={this.props.layout} />
				</div>
			);
		}
	});
});
