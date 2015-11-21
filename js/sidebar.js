define(function() {
	return React.createClass({
		render: function () {
			var activityTabClass = historyTabClass = statisticsTabClass = 'sidebar__nav-item';

			switch (this.props.activeTab) {
				case 'activity':
					activityTabClass += ' active';
				break;

				case 'history':
					historyTabClass += ' active';
				break;

				case 'statistics':
					statisticsTabClass += ' active';
				break;
			}

			return (
				React.createElement("div", {className: "sidebar"}, 
					React.createElement("nav", {id: "navigation", className: "sidebar__nav"}, 
						React.createElement("a", {className: activityTabClass, onClick: this.props.layout.selectActivityTab}, "activity", React.createElement("i", {className: "icon-menu icon-upload-cloud"})), 
						React.createElement("a", {className: historyTabClass, onClick: this.props.layout.selectHistoryTab}, "history", React.createElement("i", {className: "icon-menu icon-statistic"})), 
						React.createElement("a", {className: statisticsTabClass, onClick: this.props.layout.selectStatisticsTab}, "statistics", React.createElement("i", {className: "icon-menu icon-chart"}))
					)
				)
			);
		}
	});
});
