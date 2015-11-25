var m = [35, 35, 35, 45]; // margins
var w = 1000 - m[1] - m[3]; // width
var h = 350 - m[0] - m[2]; // height
var barw = 600 - m[1] - m[3];
var barh = 400 - m[1] - m[3];
var x, y, y1, y2;
var lineHeight = 20;
var radius = lineHeight/2;

var calPlayers = ['Kravish','Wallace','Bird','Singer','Tarwater','Matthews','Okoroh','Chauca'];

var stanfordPlayers = ['Nastic','Randle','Allen','Humphrey','Brown','Travis','Cartwright'];

var playersStats = {
    'Kravish': {
      'pts': 0,
      'fgatt':0,
      'fg':0,
      'fg%':0,
      '3pt':0,
      '3ptatt':0,
      '3pt%':0,
      'reb':0,
      'oreb':0,
      'fouls':0,
      'ast':0,
      'stl':0,
      'ft':0,
      'ftatt':0,
      'ft%':0,
      'blk':0,
      'to':0
    }
}

var selectPlayers = [];

// loadGameData(gameInfo);
// fullgame = ncaaFullgame;

fullgame[0]['stats']= {};
fullgame[0].stats['STANFORD'] = {
      'pts': 0,
      'fgatt':0,
      'fg':0,
      'fg%':0,
      '3pt':0,
      '3ptatt':0,
      '3pt%':0,
      'reb':0,
      'oreb':0,
      'fouls':0,
      'ast':0,
      'stl':0,
      'ft':0,
      'ftatt':0,
      'ft%':0,
      'blk':0,
      'to':0
    };
fullgame[0].stats['CAL'] = {
      'pts': 0,
      'fgatt':0,
      'fg':0,
      'fg%':0,
      '3pt':0,
      '3ptatt':0,
      '3pt%':0,
      'reb':0,
      'oreb':0,
      'fouls':0,
      'ast':0,
      'stl':0,
      'ft':0,
      'ftatt':0,
      'ft%':0,
      'blk':0,
      'to':0
    };

$.each(fullgame, function(i,d) {
  if (i >0 ) {
    // if (d.text.search("Kravish") != -1) {
    //   processPlay(d);
    // }
    processPlay(i);
    createLogEvent(i);
    
  }
  else {
    d.event = '';
  }
});

function createLogEvent(i) {
  var ev = fullgame[i];
  if (ev.text != '')
    $("#gameLog ul").append('<li val="'+i+'">'+getHalfTime(fullgame[i].time) +" - "+ fullgame[i].text+'</li>');
}

$("#gameLog li").on('mouseover', function() {
  var d = fullgame[$(this).attr('val')];
  // stylePlayHover(d)
  // playHover(d);
  // $("#playbyplay").html(d.time+" - "+d.text);
  // $(this).css('z-index',10);
  // mousemove(x(time_to_elapsed_secs(d.time)))
  d3.select("rect#playHover")
      .attr({
        'x': x(time_to_elapsed_secs(d.time)),
        'width':.5,
        'y':lineHeight,
        'height': h-(lineHeight*2)
      });

  d3.select("text#timeSlider")
      .attr("x",x(time_to_elapsed_secs(d.time))+2)
      .attr("y", y(0) + 15)
      .text(getHalfTime(d.time));

  $("#playbyplay").html("<span class='"+d.team+"'>"+d.team+"</span>"+d.text);
  $("#gameTime").html(getHalfTime(d.time));
  $("#cal .score").html(d.stats['CAL']['pts']);
  $("#stanford .score").html(d.stats['STANFORD']['pts']);
})
 

var svg = d3.select("#viz").append("svg:svg")
      .attr("width", w +5)
      .attr("height", h +5)
      .attr('id', 'graph1');

var getMaxValues = function() {
  var margins = $.map(fullgame, function(play,i) {
    return play.margin;
  })
  return {
    'max': Math.max.apply(null,margins),
    'min':Math.min.apply(null,margins)
  }
}

// draw axes
x = d3.scale.linear().domain([0, 2400]).range([20, w]);
y = d3.scale.linear().domain([getMaxValues().min-2, getMaxValues().max+2]).range([h-lineHeight, lineHeight]);
var xAxis = d3.svg.axis().scale(x).ticks(0).tickSize(0,0);
//var yAxisLeft = d3.svg.axis().scale(y).ticks(0).tickSize(0,0).tickValues([0,25,50,75,100]).orient("left");
var yAxisLeft = d3.svg.axis().scale(y).orient("left");



// x axis
svg.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(xAxis);

// y axis
svg.append("svg:g")
      .attr("class", "y y1 axis")
      .attr("transform", "translate(20,0)")
      .call(yAxisLeft);


// halftime line
svg.append("line")
	.attr({
	  "x1": w/4+11,
	  "y1": 0,
	  "x2": w/4+11,
	  "y2": h,
	  'class': 'quarterLine'
});
svg.append("line")
  .attr({
    "x1": w/2+11,
    "y1": 0,
    "x2": w/2+11,
    "y2": h,
    'class': 'halftimeLine'
});
svg.append("line")
  .attr({
    "x1": (w/4)*3+5,
    "y1": 0,
    "x2": (w/4)*3+5,
    "y2": h,
    'class': 'quarterLine'
});
svg.append("line")
  .attr({
    "x1": w,
    "y1": 0,
    "x2": w,
    "y2": h,
    'class': 'halftimeLine'
});

var bars2 = d3.select("#barviz").append("svg:svg")
      .attr("width", barw + m[1] + m[3])
      .attr("height", barh + m[0] + m[2])
      .attr('id', 'barsvg');

// hover code - update bars
svg.append("rect")
  .attr({
    "opacity": 0, 
    "width":w , 
    "height":h, 
    'class':'focusbox', 
    'id':'svgfocus'
  })
  .on({
    'mousemove': function() {
      return mousemove(d3.mouse(this)[0])
    }
  });

//Adding the time slider
svg.append("text")
  .attr("class", "axislabel timetext")
  .attr("text-anchor", "start")
  .attr("id", "timeSlider");

svg.append("text")
  .attr({
    "class":'teamLabel',
    'x': w-40,
    'y': y(0)-5
  })
  .text("CAL");

  svg.append("text")
  .attr({
    "class":'teamLabel',
    'x': w-95,
    'y': y(0)+20
  })
  .text("STANFORD");

function mousemove(x) {
  // using the x value of the mouse, get the player's FG%, and team's FG% up to this point
  barStats = getStatsForX(x);
  d3.select("rect#playHover")
            .attr({
              'x':x,
              'width':.5,
              'y':lineHeight,
              'height': h-(lineHeight*2)
            });
  //updateBars(barStats);

  d3.select("text#timeSlider")
      .attr("x",x+2)
      .attr("y", y(0) + 15)
      .text(getHalfTime(barStats.time));
}

function getHalfTime(time) {
  time = time.split(":");
  if (time[0]>=20) {
    time[0] = time[0]-20;
  }
  return time[0]+":"+time[1];

}

var getIconType = function(play) {
  switch (play) {
    case '2pts':
      return 'FG';
    
    case '3pt':
      return '3P';

    case 'Blk':
      return 'BK';

    case 'FT':
      return 'FT';

    case 'Foul':
      return 'PF';

    case 'Miss':
      return 'FG';

    case 'Missed FG':
      return 'FG';

    case 'Missed 3pt':
      return '3P';

    case 'Missed FT':
      return 'FT';

    case 'OReb':
      return 'OR';

    case 'Stl':
      return 'ST';

    case 'Reb':
      return 'DR';

    case 'TO':
      return 'TO';

    default:
      return '';
  }
}

var getPlayClass = function(play) {
  switch (play) {
    case '2pts':
      return 'fg';
    
    case '3pt':
      return '3pt';

    case 'Blk':
      return 'blk';

    case 'FT':
      return 'ft';

    case 'Foul':
      return 'fouls';

    case 'Miss':
      return 'fgatt';

    case 'Missed FG':
      return 'fgatt';

    case 'Missed 3pt':
      return '3ptatt';

    case 'Missed FT':
      return 'ftatt';

    case 'OReb':
      return 'oreb';

    case 'Stl':
      return 'stl';

    case 'Reb':
      return 'reb';

    case 'TO':
      return 'to';

    default:
      return '';
  }
}

var togglePlayType = function(play) {
  var playType = $(play).attr('value');
  if (playType == 'All') {
    $(".play").toggle();
    var buttons = $(".btn-sm")
    buttons.toggleClass('btn-primary');
    buttons.toggleClass('btn-default');
    //$(".btn-primary").toggleClass('btn-primary');
  }
  else {
    $("."+playType).toggle();
    $(play).toggleClass('btn-default');
    $(play).toggleClass('btn-primary');
  }  
}

var playbars = svg.selectAll('g')
            .data(fullgame)
            .enter()
            .append('g')
            .attr({
              class: function(d) {
                var classes = 'play '+getPlayClass(d.event);
                if (d.event != '') {
                  if ($.inArray(d.event,['3pt','Stl','2pts','Reb','OReb','FT','Blk','Steal'])!=-1) {
                    classes+= ' pos';
                  }
                  else {
                    classes+= ' neg';
                  }
                }
                return classes;
              } 
            })
            .on("mouseover", function(d,i) {
              d3.select("rect#playHover")
              stylePlayHover(d)
              playHover(d);
              // $("#playbyplay").html(d.time+" - "+d.text);
              $("#playbyplay").html("<span class='"+d.team+"'>"+d.team+"</span>"+d.text);
              $("#gameTime").html(getHalfTime(d.time));
              $("#cal .score").html(d.stats['CAL']['pts']);
              $("#stanford .score").html(d.stats['STANFORD']['pts']);
              $(this).css('z-index',10);
            })
            .on("mouseout",function(d) {
              stylePlayHover('black')
              d3.select("rect#playHover")
                  .attr({
                    'height':0,
                    'width':0
                  });
              $("#playbyplay").html('');
              // $("#gameTime").html('');
            }); 

playbars.append('circle')
  .attr({
    cx: function(d) {
      return x(time_to_elapsed_secs(d.time));
    },
    cy: function(d) {
      if (d.team =='CAL')
        return radius+1; //Placed at the top of the SVG
      else if(d.team == 'STANFORD')
        return h - lineHeight+radius+1;
    },
    r: function(d) {
      if (d.event != '')
        return radius;
    },
    // class: function(d) {
    //   if (d.event != '') {
    //     if ($.inArray(d.event,['3pt','Stl','2pts','Reb','OReb','FT','Blk','Steal'])!=-1) {
    //       return 'pos';
    //     }
    //     else {
    //       return 'neg';
    //     }
    //   }
    // }
  }) 

playbars.append('text')
  .attr({
    x: function(d) {
      return x(time_to_elapsed_secs(d.time))-(radius/2);
    },
    y: function(d) {
      if (d.event != '') {
        if (d.team =='CAL')
          return radius+4;
        else if(d.team == 'STANFORD')
          return h - lineHeight+radius+4;
      }
      // return h - y(d.margin);
    }
  })
  .text(function(d) {
    return getIconType(d.event);
  });


//Margin of victory line
var line = d3.svg.line()
      .x(function(d) {
        return x(time_to_elapsed_secs(d.time));
      })
      .y(function(d) {
        return y(d.margin);
      })
      .interpolate("monotone");

svg.append('path')
  .datum(fullgame)
  .attr('class','line')
  .attr("d",line);

// x axis labels
// svg.append("text")
//   .attr("class", "axislabel timetext")
//   .attr("text-anchor", "middle")
//   .attr("x", 20)
//   .attr("y", y(0) + 15)
//   .text("20:00");
// svg.append("text")
//   .attr("class", "axislabel timetext")
//   .attr("text-anchor", "middle")
//   .attr("x", w/4 + 20)
//   .attr("y", y(0) + 15)
//   .text("10:00");
// svg.append("text")
//   .attr("class", "axislabel timetext")
//   .attr("text-anchor", "middle")
//   .attr("x", w/2+20)
//   .attr("y", y(0) + 15)
//   .text("20:00");
// svg.append("text")
//   .attr("class", "axislabel timetext")
//   .attr("text-anchor", "middle")
//   .attr("x", 3*w/4 + 20)
//   .attr("y", y(0) + 15)
//   .text("10:00");

svg.append('rect')
    .attr('id','playHover');

svg.append('timelineIndicator')
    .attr('id','timeIndicator');


function getStatsForX(x) {
  x -= 10;
  x = Math.round((x*2400/w));
  //console.log(fullgame[x].stats.Kravish)
  
  if (fullgame[x].text != '') {
    //$("#playbyplay").html(getHalfTime(fullgame[x].time)+" - "+fullgame[x].text);
    // $("#playbyplay").html(fullgame[x].text);
    // $("#gameTime").html(getHalfTime(fullgame[x].time));

    $("#playbyplay").html("<span class='"+fullgame[x].team+"'>"+fullgame[x].team+"</span>"+fullgame[x].text);
    $("#gameTime").html(getHalfTime(fullgame[x].time));
    $("#cal .score").html(fullgame[x].stats['CAL']['pts']);
    $("#stanford .score").html(fullgame[x].stats['STANFORD']['pts']);
  }

  return fullgame[x];
    
  // if (JSON.stringify(fullgame[x].text != ''))
  //   $("#playbyplay").html(JSON.stringify(fullgame[x].stats.Kravish.time+" - "+JSON.stringify(fullgame[x].stats.Kravish.text)));
  // return {
    //'fgpercent': fullgame[x].stats['Kravish']['fg%'],
    // 'fgpercentothers': 100
  // }
}

function updateBars(barStats) {
  bars2.selectAll('text').remove();

  // bars2.append("text")
  //   .attr("class", "playername")
  //   .attr("text-anchor", "left")
  //   .attr("x", 20)
  //   .attr("y", 20)
  //   .text("Kravish");
  // bars2.append("text")
  //   .attr("class", "playername")
  //   .attr("text-anchor", "left")
  //   .attr("x", 20)
  //   .attr("y", 60)
  //   .text("Rest of team");

  // fg% text
  bars2.append("text")
    .attr("class", "playername")
    .attr("text-anchor", "left")
    .attr("x", 360)
    .attr("y", 20)
    .text(parseFloat(barStats.fgpercent).toFixed(1) + ' FG %');
  bars2.append("text")
    .attr("class", "playername")
    .attr("text-anchor", "left")
    .attr("x", 360)
    .attr("y", 60)
    .text(parseFloat(barStats.fgpercentothers).toFixed(1) + ' FG %');


  // remove bars
  bars2.selectAll('rect').remove();


  bars2.append('rect')
    .attr({
      x: 150, // margin
      y: 0,
      height: 30,
      width: function() {
        return Math.round(barStats.fgpercent*2); // up to 200
      },
      class: 'statsbars'
    });

  bars2.append('rect')
    .attr({
      x: 150, // margin
      y: 40,
      height: 30,
      width: function() {
        return Math.round(barStats.fgpercentothers*2); // up to 200
      },
      class: 'statsbars'
    });
}




// # of seconds elapsed from the beginning of the game.
function time_to_elapsed_secs(timestr) {
	timesplit = timestr.split(":");
	timeseconds = timesplit[0] * 60 + Number(timesplit[1]);
	return 2400 - timeseconds;
}

// x = d3.scale.linear().domain([0, alldata.length]).range([0, w]);
// y = d3.scale.linear().domain([0, 100]).range([fh, 0]);

// var line = d3.svg.line()
// .x(function(d,i) { 
//   return x(i);
// })
// .y(function(d) { 
//   // scale is a % of the max 0.6977672 (caltrain at townsend and 4th)
//   return y((d.s[stationindex].s / .6977672)*100); 
// })

function processPlay(i) {

  var d = fullgame[i];
  var prev = fullgame[i-1];

  var play= '';
  if (d.text.search('made Jumper')!= -1)
    play ="2pts";
  else if (d.text.search('missed Jumper') != -1)
    play = 'Missed FG';
  else if (d.text.search('Foul') != -1)
    play = 'Foul';
  else if (d.text.search('Block') != -1)
    play = 'Blk';
  else if (d.text.search('Defensive Rebound') != -1)
    play = 'Reb';
  else if (d.text.search('Offensive Rebound') != -1)
    play = 'OReb';
  else if (d.text.search('Turnover') != -1)
    play = 'TO';
  else if (d.text.search('made Free Throw') != -1)
    play = 'FT';
  else if (d.text.search('missed Free Throw') != -1)
    play = 'Missed FT';
  else if (d.text.search('made Layup') != -1)
    play = '2pts';
  else if (d.text.search('made Two Point') != -1)
    play = '2pts';
  else if (d.text.search('missed Layup') != -1)
    play = 'Miss';
  else if (d.text.search('made Three Point') != -1)
    play = '3pt';
  else if (d.text.search('missed Three Point') != -1)
    play = 'Missed 3pt';
  else if (d.text.search('Steal') != -1)
    play = 'Stl';
  else if (d.text.search('Dunk') != -1)
    play = '2pts';

  d.event = play;
  d.stats = {'CAL':{}, 'STANFORD':{}};

  d.stats['CAL'] = {
      'pts': prev.stats['CAL']['pts'],
      'fgatt':prev.stats['CAL']['fgatt'],
      'fg':prev.stats['CAL']['fg'],
      'fg%':prev.stats['CAL']['fg%'],
      '3pt':prev.stats['CAL']['3pt'],
      '3ptatt':prev.stats['CAL']['3ptatt'],
      '3pt%':prev.stats['CAL']['3pt%'],
      'reb':prev.stats['CAL']['reb'],
      'oreb':prev.stats['CAL']['oreb'],
      'fouls':prev.stats['CAL']['fouls'],
      'ast':prev.stats['CAL']['ast'],
      'stl':prev.stats['CAL']['stl'],
      'ft':prev.stats['CAL']['ft'],
      'ftatt':prev.stats['CAL']['ftatt'],
      'ft%':prev.stats['CAL']['ft%'],
      'blk':prev.stats['CAL']['blk'],
      'to':prev.stats['CAL']['to']
    };

  d.stats['STANFORD'] = {
    'pts': prev.stats['STANFORD']['pts'],
    'fgatt':prev.stats['STANFORD']['fgatt'],
    'fg':prev.stats['STANFORD']['fg'],
    'fg%':prev.stats['STANFORD']['fg%'],
    '3pt':prev.stats['STANFORD']['3pt'],
    '3ptatt':prev.stats['STANFORD']['3ptatt'],
    '3pt%':prev.stats['STANFORD']['3pt%'],
    'reb':prev.stats['STANFORD']['reb'],
    'oreb':prev.stats['STANFORD']['oreb'],
    'fouls':prev.stats['STANFORD']['fouls'],
    'ast':prev.stats['STANFORD']['ast'],
    'stl':prev.stats['STANFORD']['stl'],
    'ft':prev.stats['STANFORD']['ft'],
    'ftatt':prev.stats['STANFORD']['ftatt'],
    'ft%':prev.stats['STANFORD']['ft%'],
    'blk':prev.stats['STANFORD']['blk'],
    'to':prev.stats['STANFORD']['to']
  };

  if (d.team != '') {
    if (play=='3pt') {
      d.stats[d.team]['pts']=prev.stats[d.team]['pts']+3;
      d.stats[d.team]['3pt']=prev.stats[d.team]['3pt']+1;
      d.stats[d.team]['3ptatt']=prev.stats[d.team]['3ptatt']+1;
      d.stats[d.team]['fgatt']=prev.stats[d.team]['fgatt']+1;
      d.stats[d.team]['fg']=prev.stats[d.team]['fg']+1;
      d.stats[d.team]['3pt%']=(d.stats[d.team]['3pt']/d.stats[d.team]['3ptatt']);
      d.stats[d.team]['fg%']=(d.stats[d.team]['fg']/d.stats[d.team]['fgatt']);
    }
    else if (play=='2pts') {
      d.stats[d.team]['fg']=prev.stats[d.team]['fg']+1;
      d.stats[d.team]['fgatt']=prev.stats[d.team]['fgatt']+1;
      d.stats[d.team]['fg%']=(d.stats[d.team]['fg']/d.stats[d.team]['fgatt'])*100.00;
      d.stats[d.team]['pts']=prev.stats[d.team]['pts']+2;
    }
    else if (play=='Missed FG') {
      d.stats[d.team]['fg']=prev.stats[d.team]['fg'];
      d.stats[d.team]['fgatt']=prev.stats[d.team]['fgatt']+1;
      d.stats[d.team]['fg%']=(d.stats[d.team]['fg']/d.stats[d.team]['fgatt'])*100.00;
      d.stats[d.team]['pts']=prev.stats[d.team]['pts'];
    }
    else if (play=='Missed 3pt') {
      d.stats[d.team]['3pt']=prev.stats[d.team]['3pt'];
      d.stats[d.team]['3ptatt']=prev.stats[d.team]['3ptatt']+1;
      d.stats[d.team]['3pt%']=(d.stats[d.team]['3pt']/d.stats[d.team]['3ptatt'])*100.00;
      d.stats[d.team]['pts']=prev.stats[d.team]['pts'];
    }
    else if (play=='FT') {
      d.stats[d.team]['pts']=prev.stats[d.team]['pts']+1;
      d.stats[d.team]['ft']=prev.stats[d.team]['ft']+1;
      d.stats[d.team]['ftatt']=prev.stats[d.team]['ftatt']+1;
      d.stats[d.team]['ft%']=(d.stats[d.team]['ft']/d.stats[d.team]['ftatt'])*100.0;
    }
    else if (play=='Missed FT') {
      d.stats[d.team]['ftatt']=prev.stats[d.team]['ftatt']+1;
      d.stats[d.team]['ft']=prev.stats[d.team]['ft'];
      d.stats[d.team]['ft%']=(d.stats[d.team]['ft']/d.stats[d.team]['ftatt'])*100.0;
    }
    else if (play=='Blk') {
      d.stats[d.team]['blk']=prev.stats[d.team]['blk']+1;
    }
    else if (play=='Stl') {
      d.stats[d.team]['stl']=prev.stats[d.team]['stl']+1;
    }
    else if (play=='Reb') {
      d.stats[d.team]['reb']=prev.stats[d.team]['reb']+1;
    }
    else if (play=='OReb') {
      d.stats[d.team]['reb']=prev.stats[d.team]['reb']+1;
      d.stats[d.team]['oreb']=prev.stats[d.team]['oreb']+1;
    }
    else if (play=='TO') {
      d.stats[d.team]['to']=prev.stats[d.team]['to']+1;
    }
    else if (play=='Foul') {
      d.stats[d.team]['fouls']=prev.stats[d.team]['fouls']+1;
    }
  }
    // console.log(i);
    // console.log(d.stats['Kravish'])
    
  fullgame[i] = d;
    // console.log(fullgame[i].stats['Kravish']);
  // }
}

function stylePlayHover(d) {
  var slider = $("#playHover");
  var type = '';

  if (d =='black') {
    slider.css('fill','black');
    slider.css('width','.5');
    return;
  }

  if (d.event != '') {
    if ($.inArray(d.event,['3pt','Stl','2pts','Reb','OReb','FT','Blk','Steal'])!=-1) {
      type = 'pos';
    }
    else {
      type = 'neg';
    }
  }
  slider.css('width','2');
  if (type =='neg')
    slider.css('fill','red');
  else if (type =='pos')
    slider.css('fill','green');
    

}

function playHover(d) {
  d3.select("rect#playHover")
      .attr({
        x: function() {
          return x(time_to_elapsed_secs(d.time));
        },
        y: function() {
          if (d.team =='CAL') {
            return lineHeight;
          } else {
            return y(d.margin);
          }
        },
        height: function() {
          if (d.team == 'CAL') {
            return y(d.margin) - lineHeight;
          } else {
            return h - y(d.margin) - lineHeight;
          }
          
        },
        width: 2
      })
}

// function drawGamePlay(lastname) {
//   svg.selectAll('rect.gameplay').remove();

//   var bars = svg.selectAll('g')
//           .data(fullgame)
//           .enter()
//           .append('g');

//   bars.append('rect')
//         .attr({
//           width:2,
//           height: function(d) {
//             if (d.event != '') {
//             //   //if (d.text.search("Kravish") != -1)
//             //   if (d.team == 'CAL') {
//             //     return y(d.margin) - (h/2);
//             //   }
//             //   else if (d.team =='STANFORD') {
//             //     return y(d.margin)-(h/2);
//             //   }
//             // }
//               return lineHeight;
//               }  
//           },
//           x: function(d) {
//             return x(time_to_elapsed_secs(d.time));
//           },
//           y: function(d) {
//             if (d.event != '') {
//               if (d.team =='CAL')
//                 return 0;
//               else if(d.team == 'STANFORD')
//                 return h - lineHeight;
//             }
//             // return h - y(d.margin);
//           },
//           class: function(d) {
//             var classes = 'gameplay '+d.team;
//             if (d.text.search("Kravish") != -1)
//               classes+= "kravish";
//             return classes;
//           },
//           fill: function(d) {
//             if (d.event != '') {
//               if ($.inArray(d.event,['3pt','Stl','2pts','Reb','OReb','FT','Block','Steal'])!=-1) {
//                 return 'green';
//               }
//               else {
//                 return 'red';
//               }
//             }
//           }
//         })
//         .on("mouseover", function(d) {
//           playHover(d);
//           console.log(d.time+" - "+d.text);
//         })
//         .on("mouseout",function(d) {
//           d3.select("div#playHover")
//               .attr({
//                 'height':0,
//                 'width':0
//               })
//         });

// }





