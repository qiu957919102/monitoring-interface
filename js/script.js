// progress bar constructor
function ProgressBar (options) {
	this.bar = options.bar;
	var bar = ProgressBar.bar = this.bar;
	
	ProgressBar.firstHalfProgress = function (bar) {
		// firstHlf is 180 deg
		// 180deg = 50%
		// x      = bar.progress
		// x = (180deg * bar.progress ) / 50%

		deg = (180 * bar.progress) / 50;

		ProgressBar.rotation(bar.hidePanel, deg);
	};

	ProgressBar.secondHalfProgress = function (bar) {
		// show first 50% fully
		bar.hidePanel.style.zIndex = '3';
		var progress = 50 - (100 - bar.progress);

		// 180deg = 50%
		// x      = progress
		//x = (180deg * progress) / 50$

		deg = (180 * progress) / 50;
		ProgressBar.rotation(bar.activePanel, deg);
	};

	ProgressBar.rotation = function (panel, deg) {
		panel.style.transform = 'rotate('+deg+'deg)'; 
		panel.style.oTransform = 'rotate('+deg+'deg)'; 
		panel.style.msTransform = 'rotate('+deg+'deg)'; 
		panel.style.MozTransform = 'rotate('+deg+'deg)'; 
		panel.style.webkitTransform = 'rotate('+deg+'deg)';
	};

	//define progress, hide(dark) panel and active2 (green) panel of every bar
	for (var i = 0; i < bar.length; i++) {
		bar[i].progress = parseFloat(bar[i].children[0].textContent);
		var panels = bar[i].children[0].children;
		for (var j = 0; j < panels.length; j++) {
			var attr = panels[j].getAttribute('data-progress');
			if (attr == 'hide-panel') {
				bar[i].hidePanel = panels[j];
			} else if (attr == 'active-panel') {
				bar[i].activePanel = panels[j];
			}
		}
	}
	
	// define current progress styling

	for (var k = 0; k < bar.length; k++) {
		if (bar[k].progress <= 50) {
			ProgressBar.firstHalfProgress(bar[k]);
		} else {
			ProgressBar.secondHalfProgress(bar[k]);
		}
	}

}

//navigation items active state
var navigation = document.getElementById('navigation');
var active = document.getElementById('active');
var historyPage = document.getElementById('history-page');

navigation.addEventListener('click', function navActive (e) {
	var target = e.target;
	if (!target.classList.contains('active')) {
		for (var i = 0; i < navigation.children.length; i++) {
			navigation.children[i].classList.remove('active');
		}

		target.classList.add('active');

		//temporaly content showing
		switch (target.textContent) {
			case 'active':
				active.style.display = "block";
				historyPage.style.display = "none";
			break;

			case 'history':
				active.style.display = "none";
				historyPage.style.display = "block";
			break;
		}

	}
});


//button group active state
var buttongroup = document.getElementsByClassName('buttongroup');

for (var i = 0; i < buttongroup.length; i++) {
	buttongroup[i].addEventListener('click', function (e) {
		var target = e.target;

		if (target != this) {
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].setAttribute('data-selected', 'false');
			}
			target.setAttribute('data-selected', 'true');
		}
	});
}

var ws = new WebSocket('ws://' + location.hostname + ':8082');

ws.onclose = function (event) {
	if (!event.wasClean) {
		alert('WebSocket connection has been closed abnormally [' + event.code + ']: ' + event.reason);
	}
};

ws.onerror = function (error) {
  alert('WebSocket error: ' + error.message);
};

ws.onmessage = function (event) {
	var message = JSON.parse(event.data);

	switch (message.action) {
		case 'listActive':
			var fragment = document.createDocumentFragment();

			message.data.forEach(function (item) {
				var htmlItem = buildActiveItem(item);
				fragment.appendChild(htmlItem);
			});

			document.getElementById('active-items-list').innerHTML = '';
			document.getElementById('active-items-list').appendChild(fragment);
			new ProgressBar({
				bar: document.getElementById('active-items-list').getElementsByClassName('progress-bar')
			});
		break;
	}
};

ws.onopen = function () {
	ws.send('{"action":"listActive"}');
	setInterval(ws.send.bind(this, '{"action":"listActive"}'), 1000);
};

function buildActiveItem(item) {
	var li = document.createElement('li');
	li.className = 'active__list-item';
	li.setAttribute('data-speed', normalizeSize(item.speed * 8) + 'it/s');
	var stuck = (new Date() - new Date(item.updated)) > 30000;
	li.innerHTML = '\
		<div class="progress-bar' + (stuck ? ' stuck' : '') + '">\
			<div class="progress">\
				<div data-progress="hide-panel" class="hide"></div>\
				<div class="active"></div>\
				<div data-progress="active-panel" class="active2"></div>\
				<span class="percentage">' + item.percent + '%</span>\
			</div>\
		</div>\
		<div class="active__info">\
			<div class="active__info-item">Total:<span> ' + normalizeSize(item.size) + '</span></div>\
			<div class="active__info-item">Remaining:<span> ' + normalizeSize(item.left) + '</span></div>\
			<div class="active__info-item">Started:<span> ' + new Date(item.started).toLocaleString() + '</span></div>\
			<div class="active__info-item">Updated:<span>' + new Date(item.updated).toLocaleString() + '</span></div>\
		</div>\
		<div class="active__discr">\
			<div class="active__discr-item">File name:<span>' + item.filename + '</span></div>\
			<div class="active__discr-item">UUID:<span>' + item.uuid + '</span></div>\
		</div>\
	';
	return li;
}

function normalizeSize(size) {
	var
		units = ['B', 'KB', 'MB', 'GB'],
		curUnit = 0
	;

	while (size > 1000) {
		curUnit++;
		size = (size / 1000).toFixed(2);
	}

	return size + ' ' + units[curUnit];
}

// appearing extra info on table row click
var table = document.getElementById('table-history');
var rows = table.tBodies[0].rows;
var cells = table.tBodies[0].rows[0].cells;

for (var i = 0; i < rows.length; i++) {
	// calculate colspan for extra cell
	if(rows[i].rowIndex % 2 == 0) {
		rows[i].cells[0].colSpan = cells.length;
	}
	rows[i].addEventListener('click', function (e) {

		var target = e.target;

		if (target != this) {
			var ifSelected = target.parentElement.getAttribute('data-selected');
			if (ifSelected == 'false') {
				//make all odd rows not selected
				for (var i = 0; i < rows.length; i++) {
					if (rows[i].rowIndex % 2 != 0) {
						rows[i].setAttribute('data-selected', 'false');	
					}
				};
				// select the target row
				target.parentElement.setAttribute('data-selected', 'true');
				
				// show row with extra info
				var extra = target.parentElement.nextElementSibling;
				//make all even rows closed
				for (var i = 0; i < rows.length; i++) {
					if (rows[i].rowIndex % 2 == 0) {
						rows[i].setAttribute('data-extra', 'closed');	
					}
				}
				extra.setAttribute('data-extra', 'opened');
				
			}
		}
	})
}
