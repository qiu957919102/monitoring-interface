define(function () {
	var ActivityItem = React.createClass({
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

		_formatData: function (activity) {
			var whatIsIt;

			switch (activity.profileId) {
				case 2:
					whatIsIt = 'Content';
				break;

				case 4:
					whatIsIt = 'Upload';
				break;

				default:
					whatIsIt = '[Unknown]';
			}

			return {
				speed: this._normalizeSpeed(activity.speed),
				isStuck: new Date() - new Date(activity.updated) > 30000,
				isHanged: new Date() - new Date(activity.updated) > 480000,
				size: this._normalizeSize(activity.size),
				left: this._normalizeSize(activity.size - activity.received),
				percent: Math.round(activity.received / (activity.size / 100)),
				started: new Date(activity.started).toLocaleString(),
				updated: new Date(activity.updated).toLocaleString(),

				filename: activity.filename,
				uuid: activity.uuid,
				uploadId: activity.uploadId,
				whatIsIt: whatIsIt
			};
		},

		render: function () {
			var
				data = this._formatData(this.props.activity),
				classNameSuffix = data.isHanged ? ' hanged' : (data.isStuck ? ' stuck' : '')
				className = 'progress-bar' + classNameSuffix,
				hidePanelStyle = {},
				activePanelStyle = {}
			;

			if (data.percent > 100) {
				data.percent = 100;
			}

			if (data.left < 0) {
				data.left = 0;
			}

			var rotateStyles = function (deg) {
				var styles = {};

				['transform', 'oTransform', 'msTransform', 'mozTransform', 'webkitTransform'].forEach(function (property) {
					styles[property] = 'rotate(' + deg + 'deg)';
				});

				return styles;
			};

			if (data.percent <= 50) {
				hidePanelStyle = rotateStyles(180 * data.percent / 50);
			} else {
				hidePanelStyle.zIndex = 3;
				activePanelStyle = rotateStyles((180 * (50 - (100 - data.percent))) / 50);
			}

			return (
				<li className="active__list-item" data-speed={data.speed}>
					<div className={className}>
						<div className="progress">
							<div className="hide" style={hidePanelStyle}></div>
							<div className="active"></div>
							<div className="active2" style={activePanelStyle}></div>
							<span className="percentage">{data.percent}%</span>
						</div>
					</div>

					<div className="active__info">
						<div className="active__info-item">Total:<span>{data.size}</span></div>
						<div className="active__info-item">Remaining:<span>{data.left}</span></div>
						<div className="active__info-item">Started:<span>{data.started}</span></div>
						<div className="active__info-item">Updated:<span>{data.updated}</span></div>
					</div>

					<div className="active__discr">
						<div className="active__discr-item">File name:<span>{data.filename}</span></div>
						<div className="active__discr-item">UUID:<span>{data.uuid}</span></div>
						<div className="active__discr-item">Upload ID:<span>{data.uploadId}</span></div>
						<div className="active__discr-item">What is it:<span>{data.whatIsIt}</span></div>
					</div>
				</li>
			);
		}
	});

	var ActivityList = React.createClass({
		render: function () {
			var activities = this.props.activities.map(function (activity) {
				return <ActivityItem key={activity.uuid} activity={activity} />
			});

			return (
				<ul id="active-items-list" className="active__list">{activities}</ul>
			);
		}
	});

	return React.createClass({
		_wsMessageHandlerId: null,
		_isFirstWsMessage: true,

		getInitialState: function() {
			return { activities: [] };
		},

		_wsMessageHandler: function (data) {
			if (this._isFirstWsMessage) {
				this.props.layout.hideLoader();
				this._isFirstWsMessage = false;
			}

			this.setState({ activities: data });
			setTimeout(this.props.layout.sendWsMessage.bind(this.props.layout, 'activities'), 500);
		},

		_handleWsMessage: function () {
			this._wsMessageHandlerId = this.props.layout.handleWsMessage('activities', this._wsMessageHandler);
		},

		componentWillMount: function () {
			this._handleWsMessage();
			this.props.layout.sendWsMessage('activities');
		},

		componentWillUnmount: function () {
			this.props.layout.removeWsMessageHandler('activities', this._wsMessageHandlerId);
			this.props.layout.showLoader();
		},

		render: function () {
			return (
				<div id="active" className="active">
					<ActivityList activities={this.state.activities} />
				</div>
			);
		}
	});
});
