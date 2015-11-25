var ncaaFullgame = [];


function loadGameData(gameInfo) {
	var home, away, file;

	home = gameInfo.details.home.abbr;
	away = gameInfo.details.away.abbr;
	file = gameInfo.id+'.csv';

	
	ncaaFullgame = createEmptyGameLog();
	loadPlaybyPlay(file,home,away);
}

function createEmptyGameLog() {
	var gameLog = []

	gameLog.push({
		time: '40:00',
		margin: 0,
		text: '',
		team: '',
		stats: {}
	});

	for (var min = 39; min >=0; min--) {
		for (var sec = 59; sec >=0; sec--) {
			var temp;
			if (sec <10)
				temp = '0'+sec;
			else 
				temp = sec;

			gameLog.push({
				time: min+':'+temp,
				margin: 0,
				text: '',
				team: '',
				stats: {}
			})
		}
	}

	return gameLog;
}

function loadPlaybyPlay(filename,home,away) {

	var data = {};
	var half = 1;

	var getPlayTime = function(time, half) {
		var min,sec;

		min = parseInt(time.split(':')[0]) + (half * 20);
		sec = time.split(':')[1];
		return min+':'+sec;
	}

	var parseScore = function(score) {
		if (score == '')
			return score;

		var away = score.split('-')[0],
			home = score.split('-')[1];

		return away-home;
	}

	var getPlayText = function(play) {
		if (play.away == '')
			return play.home;
		else
			return play.away;
	}

	var getPlayTeam = function (play) {
		if (play.away.indexOf('Official') != -1)
			return '';
		else if (play.away == '')
			return gameInfo.details.home.abbr;
		else
			return gameInfo.details.away.abbr;
	}

	d3.csv(filename, function(d) {
		var playText = getPlayText(d),
			playTime = getPlayTime(d.time,half);

		var play = {
			time: playTime,
			margin: parseScore(d.score),
			text: playText,
			team: getPlayTeam(d)
		};

		if (typeof data[playTime] === 'undefined') {
			data[playTime] = [];
		}
		data[playTime].push(play);

		if (playText.indexOf('End of 1st') !== -1) {
			half = 0;
		}
	}, function() {
		$.each(ncaaFullgame, function (index,logItem) {
			var play = data[logItem.time];
			if (!!play) {
				logItem.margin = play[0].margin;
				logItem.text = play[0].text;
				logItem.team = play[0].team;
			}
		});
	})
	
}

