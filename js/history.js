var History = React.createClass({displayName: "History",
	render: function () {
		React.createElement("div", {id: "history-page", className: "history"}, 
			React.createElement("div", {className: "buttongroup"}, 
				React.createElement("button", {type: "button", "data-selected": "true", className: "transparent-button first"}, "All"), 
				React.createElement("button", {type: "button", "data-selected": "false", className: "transparent-button"}, "Normal"), 
				React.createElement("button", {type: "button", "data-selected": "false", className: "transparent-button last"}, "Errors")
			), 

			React.createElement("div", {className: "table"}, 
				React.createElement("table", {id: "table-history"}, 
					React.createElement("thead", null, 
						React.createElement("tr", null, 
							React.createElement("th", null, "Date"), 
							React.createElement("th", null, "Video"), 
							React.createElement("th", null, "Time"), 
							React.createElement("th", null, "Size")
						)
					), 
					React.createElement("tbody", null, 
						React.createElement("tr", {"data-selected": "false"}, 
							React.createElement("td", null, "asdfsfafs"), 
							React.createElement("td", null, "asdfsfafs"), 
							React.createElement("td", null, "asdfsfafs"), 
							React.createElement("td", null, "asdfsfafs")
						), 
						React.createElement("tr", {"data-extra": "closed"}, 
							React.createElement("td", {colspan: ""}, "kjflkajsdf")
						), 
						React.createElement("tr", {"data-selected": "false"}, 
							React.createElement("td", null, "asdfsfafs"), 
							React.createElement("td", null, "asdfsfafs"), 
							React.createElement("td", null, "asdfsfafs"), 
							React.createElement("td", null, "asdfsfafs")
						), 
						React.createElement("tr", {"data-extra": "closed"}, 
							React.createElement("td", {colspan: ""}, "kjflkajsdf")
						), 
						React.createElement("tr", {"data-selected": "false"}, 
							React.createElement("td", null, "asdfsfafs"), 
							React.createElement("td", null, "asdfsfafs"), 
							React.createElement("td", null, "asdfsfafs"), 
							React.createElement("td", null, "asdfsfafs")
						), 
						React.createElement("tr", {"data-extra": "closed"}, 
							React.createElement("td", {colspan: ""}, "kjflkajsdf")
						)
					)
				)
			)
		)
	}
});