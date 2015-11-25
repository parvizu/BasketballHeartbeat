/*
	Function that will load the raw data and process it for consumption by the front end
*/
function processRawData(filename, type) {

	var blankGame = createNBAGameClock();


}

function createNBAGameClock() {
	var game ={};
	for (var i = 1;i<= 4; i++) {
		for (var j = 720; j>=0; j--) {
			var seconds = j%60;
			var minutes = Math.floor(j/60);

			// if (minutes <10)
                // minutes = '0'+minutes;
            if (seconds <10)
                seconds = '0'+seconds;

			game[i+"."+minutes+':'+seconds] = {
				updated : 0,
				time: minutes+':'+seconds,
				quarter: i,
				facts: {
					away: [],
					home: [],
					other: []
				},
				team:'',
				scoreBoard: {
					home: 0,
					away: 0,
					margin: 0,
					score: ''
				},
				stats: {
					away: {
						team: {}
					},
					home: {
						team: {}
					}
				}
			};
		}
	}
	return game;
}


function standarizeData() {
	var pbp = createNBAGameClock(),
		game = {},
		currentPlay, 
		currentQtr,
		away = fileIn.GameInfo[0].AwayTeam['short'] = fileIn.GameInfo[0].AwayTeam.href.slice(42,45),
		home = fileIn.GameInfo[0].HomeTeam['short'] = fileIn.GameInfo[0].HomeTeam.href.slice(42,45);

	var tempStats = {
		margin:0,
		away:0,
		home:0
	};

	$.each(fileIn.PlaybyPlay, function(i,rawPlay) {
		if (rawPlay.TeamA.search('Start of') !=-1)
			currentQtr = rawPlay.TeamA.slice(9,10);

		key = currentQtr +"."+rawPlay.gameClock.split('.')[0]
		currentPlay = pbp[key];

		if (currentPlay.facts.length==0) {
			if (rawPlay.TeamB == "") {
				currentPlay.team = away;
			} else if (rawPlay.TeamA == "") {
				currentPlay.team = home;
			}
		}
		currentPlay.facts = getRawPlayFact(currentPlay.facts,rawPlay); 
		if (rawPlay.score != "")
			currentPlay.scoreBoard = getScoreData(rawPlay.score); 

		currentPlay.updated = 1; 
	});

	fillBlanks(pbp);

	return pbp;
}

function getScoreData(score) {
	return {
		margin: score.split("-")[1] - score.split("-")[0],
		home: score.split("-")[1],
		away: score.split("-")[0],
		score : score
	} 
}

function getRawPlayFact(facts,rawPlay) {
	if (rawPlay.TeamA == rawPlay.TeamB) {
		facts.other.push(rawPlay.TeamA);
	} else if (rawPlay.TeamB == "") {
		facts.away.push(rawPlay.TeamA);
	} else {
		facts.home.push(rawPlay.TeamB);
	}
	return facts;
}

function extractPlay(playText,team) {
	var play = '';
	var stats = {
			away: {
				team: {}
			},
			home: {
				team: {}
			}
		};
	

	if (playText.text.search('makes 2-pt shot')!= -1)
		play ="2pts";
	else if (playText.text.search('misses 2-pt shot') != -1)
		play = 'Missed FG';
	else if (playText.text.search('Foul') != -1)
		play = 'Foul';
	else if (playText.text.search('Block') != -1)
		play = 'Blk';
	else if (playText.text.search('Defensive rebound') != -1)
		play = 'Reb';
	else if (playText.text.search('Offensive rebound') != -1)
		play = 'OReb';
	else if (playText.text.search('Turnover') != -1)
		play = 'TO';
	else if (playText.text.search('made Free Throw') != -1)
		play = 'FT';
	else if (playText.text.search('missed Free Throw') != -1)
		play = 'Missed FT';
	else if (playText.text.search('made Layup') != -1)
		play = '2pts';
	else if (playText.text.search('made Two Point') != -1)
		play = '2pts';
	else if (playText.text.search('missed Layup') != -1)
		play = 'Miss';
	else if (playText.text.search('makes 3-pt shot') != -1)
		play = '3pt';
	else if (playText.text.search('misses 3-pt shot') != -1)
		play = 'Missed 3pt';
	else if (playText.text.search('Steal') != -1)
		play = 'Stl';
	else if (playText.text.search('Dunk') != -1)
		play = '2pts';	


}

function fillBlanks(data) {
	var current = {},
		previous = {},
		key,
		seconds,
		minutes;

	for (var i = 1;i<= 4; i++) {
		for (var j = 720; j>=0; j--) {
			var seconds = j%60;
			var minutes = Math.floor(j/60);
            if (seconds <10)
                seconds = '0'+seconds;
			key = i+'.'+minutes+":"+seconds;
			current = data[key];

			if (current.updated==0) {
				current.scoreBoard = previous.scoreBoard;
				current.stats = previous.stats;
			}
			
			delete current.updated;
			previous = current;
		}
	}
}