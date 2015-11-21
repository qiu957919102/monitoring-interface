define(function () {
	var ActivityItem = React.createClass({displayName: "ActivityItem",
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
				React.createElement("li", {className: "active__list-item", "data-speed": data.speed}, 
					React.createElement("div", {className: className}, 
						React.createElement("div", {className: "progress"}, 
							React.createElement("div", {className: "hide", style: hidePanelStyle}), 
							React.createElement("div", {className: "active"}), 
							React.createElement("div", {className: "active2", style: activePanelStyle}), 
							React.createElement("span", {className: "percentage"}, data.percent, "%")
						)
					), 

					React.createElement("div", {className: "active__info"}, 
						React.createElement("div", {className: "active__info-item"}, "Total:", React.createElement("span", null, data.size)), 
						React.createElement("div", {className: "active__info-item"}, "Remaining:", React.createElement("span", null, data.left)), 
						React.createElement("div", {className: "active__info-item"}, "Started:", React.createElement("span", null, data.started)), 
						React.createElement("div", {className: "active__info-item"}, "Updated:", React.createElement("span", null, data.updated))
					), 

					React.createElement("div", {className: "active__discr"}, 
						React.createElement("div", {className: "active__discr-item"}, "File name:", React.createElement("span", null, data.filename)), 
						React.createElement("div", {className: "active__discr-item"}, "UUID:", React.createElement("span", null, data.uuid)), 
						React.createElement("div", {className: "active__discr-item"}, "Upload ID:", React.createElement("span", null, data.uploadId)), 
						React.createElement("div", {className: "active__discr-item"}, "What is it:", React.createElement("span", null, data.whatIsIt))
					)
				)
			);
		}
	});

	var ActivityList = React.createClass({displayName: "ActivityList",
		render: function () {
			var activities = this.props.activities.map(function (activity) {
				return React.createElement(ActivityItem, {key: activity.uuid, activity: activity})
			});

			return (
				React.createElement("ul", {id: "active-items-list", className: "active__list"}, activities)
			);
		}
	});

	return React.createClass({
		_wsInterval: null,
		_wsMessageHandlerId: null,

		getInitialState: function() {
			return { activities: [] };
		},

		_startPolling: function () {
			this._wsInterval = setInterval(
				this.props.layout.sendWsMessage.bind(this.props.layout, 'activities'),
				1000
			);
		},

		_stopPolling: function () {
			if (this._wsInterval) {
				clearInterval(this._wsInterval);
			}
		},

		_handleWsMessage: function () {
			this._wsMessageHandlerId = this.props.layout.handleWsMessage('activities', function (data) {
				this.setState({ activities: data });

				if (!this._wsInterval) {
					this._startPolling();
				}
			}.bind(this));
		},

		componentWillMount: function () {
			this._handleWsMessage();
			this.props.layout.sendWsMessage('activities');
		},

		componentWillUnmount: function () {
			this._stopPolling();
			this.props.layout.removeWsMessageHandler('activities', this._wsMessageHandlerId);
		},

		render: function () {
			return (
				React.createElement("div", {id: "active", className: "active"}, 
					React.createElement(ActivityList, {activities: this.state.activities})
				)
			);
		}
	});
});
