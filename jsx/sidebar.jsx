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
				<div className="sidebar">
					<nav id="navigation" className="sidebar__nav">
						<a className={activityTabClass} onClick={this.props.layout.selectActivityTab}>activity<i className="icon-menu icon-upload-cloud"></i></a>
						<a className={historyTabClass} onClick={this.props.layout.selectHistoryTab}>history<i className="icon-menu icon-statistic"></i></a>
						<a className={statisticsTabClass} onClick={this.props.layout.selectStatisticsTab}>statistics<i className="icon-menu icon-chart"></i></a>
					</nav>
				</div>
			);
		}
	});
});
