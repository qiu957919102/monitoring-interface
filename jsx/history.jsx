define(function() {
	return React.createClass({
		render: function () {
			return (
				<div id="history-page" className="history">
					<div className="buttongroup">
						<button type="button" data-selected="true" className="transparent-button first">All</button>
						<button type="button" data-selected="false" className="transparent-button">Normal</button>
						<button type="button" data-selected="false" className="transparent-button last">Errors</button>
					</div>

					<div className="table">
						<table id="table-history">
							<thead>
								<tr>
									<th>Date</th>
									<th>Video</th>
									<th>Time</th>
									<th>Size</th>
								</tr>
							</thead>
							<tbody>
								<tr data-selected="false">
									<td>asdfsfafs</td>
									<td>asdfsfafs</td>
									<td>asdfsfafs</td>
									<td>asdfsfafs</td>
								</tr>
								<tr data-extra="closed">
									<td colspan="">kjflkajsdf</td>
								</tr>
								<tr data-selected="false">
									<td>asdfsfafs</td>
									<td>asdfsfafs</td>
									<td>asdfsfafs</td>
									<td>asdfsfafs</td>
								</tr>
								<tr data-extra="closed">
									<td colspan="">kjflkajsdf</td>
								</tr>
								<tr data-selected="false">
									<td>asdfsfafs</td>
									<td>asdfsfafs</td>
									<td>asdfsfafs</td>
									<td>asdfsfafs</td>
								</tr>
								<tr data-extra="closed">
									<td colspan="">kjflkajsdf</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			);
		}
	});
});
