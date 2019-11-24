var vgTotal,
    vGGenreDS,
    vgAction,
    vgShooter,
    vgSelectedBar = null,
    vgSelectedGenre = "Action",
    crimeState;

var crimeDS,
    selectedState = "the USA", //TODO retirar depois
    selectedCrimeType = "violent_crime",
    //selectedStates = ["AK", "AL", "AR"],
    //stateColors = [d3.schemeDark2[0], d3.schemeDark2[1], d3.schemeDark2[2]],
    crimeSelectedDot = null;

var year_filters = [1979, 2016];
var year_hovered = null;

var colorDict = {}
colorDict["Action"] = d3.schemeSet3[0];
colorDict["Action_Adventure"] = d3.schemeSet3[1];
colorDict["Adventure"] = d3.schemeSet3[2];
colorDict["Board_Game"] = d3.schemeSet3[3];
colorDict["Education"] = d3.schemeSet3[4];
colorDict["Fighting"] = d3.schemeSet3[5];
colorDict["Misc"] = d3.schemeSet3[6];
colorDict["MMO"] = d3.schemeSet3[7];
colorDict["Music"] = d3.schemeSet3[8];
colorDict["Party"] = d3.schemeSet3[9];
colorDict["Platform"] = d3.schemeSet3[10];
colorDict["Puzzle"] = d3.schemeSet3[11];
colorDict["Racing"] = d3.schemeSet2[0];
colorDict["Role_Playing"] = d3.schemeSet2[1];
colorDict["Sandbox"] = d3.schemeSet2[2];
colorDict["Shooter"] = d3.schemeSet2[3];
colorDict["Simulation"] = d3.schemeSet2[4];
colorDict["Sports"] = d3.schemeSet2[5];
colorDict["Strategy"] = d3.schemeSet2[6];
colorDict["Visual_Novel"] = d3.schemeSet2[7];

var genreId = {}
genreId["Action"] = 1;
genreId["Action_Adventure"] = 2;
genreId["Adventure"] = 3;
genreId["Board_Game"] = 4;
genreId["Education"] = 5;
genreId["Fighting"] = 6;
genreId["Misc"] = 7;
genreId["MMO"] = 8;
genreId["Music"] = 9;
genreId["Party"] = 10;
genreId["Platform"] = 11;;
genreId["Puzzle"] = 12;
genreId["Racing"] = 13;
genreId["Role_Playing"] = 14;
genreId["Sandbox"] = 15;
genreId["Shooter"] = 16;
genreId["Simulation"] = 17;
genreId["Sports"] = 18;
genreId["Strategy"] = 19;
genreId["Visual_Novel"] = 20;

var crimeNameDic = {}
crimeNameDic["violent_crime"] = "Violent crime"
crimeNameDic["homicide"] = "Homicide"
crimeNameDic["rape_legacy"] = "Rape legacy"
crimeNameDic["rape_revised"] = "Rape revised"
crimeNameDic["robbery"] = "Robbery"
crimeNameDic["aggravated_assault"] = "Aggravated assault"
crimeNameDic["property_crime"] = "Property crime"
crimeNameDic["burglary"] = "Burglary"
crimeNameDic["larceny"] = "Larceny"
crimeNameDic["motor_vehicle_theft"] = "Motor vehicle theft"

var stateDir = {
    "AK": "Alaska",
    "AL": "Alabama",
    "AR": "Arkansas",
    "AZ": "Arizona",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DC": "District of Columbia",
    "DE": "Delaware",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "IA": "Iowa",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "MA": "Massachusetts",
    "MD": "Maryland",
    "ME": "Maine",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MO": "Missouri",
    "MS": "Mississippi",
    "MT": "Montana",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "NE": "Nebraska",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NV": "Nevada",
    "NY": "New York",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VA": "Virginia",
    "VT": "Vermont",
    "WA": "Washington",
    "WI": "Wisconsin",
    "WV": "West Virginia",
    "WY": "Wyoming",
    "the USA": "the USA"
}

// utility function
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
};

function removeOtherGenres(data, genre) {
    var colIndex = genreId[genre];
    for (var j = 0; j < 20; j++) {
        if (j != 1 || j != colIndex) {
            var temp = data.toString().split("\n");
            for (var i = 0; i < temp.length; ++i) {
                temp[i] = temp[i].split(",");
                temp[i].splice(colIndex, 1);
                temp[i] = temp[i].join(","); // comment this if you want a 2D array
            }
        }
    }
    return temp.join("\n"); // returns CSV
    //return temp; // returns 2D array
    //return d3.csv.parse(temp); // returns a parsed object
}

/* d3.csv("/data/vg/Action.csv").then(function (data) {
    data.forEach(function (d) {
        d.Num = +Num;
    });
    vgAction = data;
});

d3.csv("/data/vg/Shooter.csv").then(function (data) {
    data.forEach(function (d) {
        d.Num = +Num;
    });
    vgShooter = data;
}); */
d3.csv("/data/crime/crimesoriginal.csv").then(function (data) {
    /* // mouse hover event
    dispatch = d3.dispatch("crimeEvent");
    dispatch.on("crimeEvent", function (vg) {
        if (crimeSelectedDot != null) {
            vgSelectedBar.attr("style", "stroke-width:0;stroke:rgb(0,0,0)");
            crimeSelectedDot.attr("r", lineChart.r);
        }
        vgSelectedBar = d3.selectAll("rect[Year=\'" + vg.Year + "\']");
        crimeSelectedDot = d3.select("circle[Year=\'" + vg.Year + "\']");
        crimeSelectedDot.attr("r", 5);
        vgSelectedBar.attr("style", "stroke-width:2;stroke:rgb(0,0,0)");
    }) */
    // convert from string to number
    data.forEach(function (d) {
        d.population = +d.population;
        d.violent_crime = +d.violent_crime;
        d.homicide = +d.homicide;
        d.rape_legacy = +d.rape_legacy;
        d.rape_revised = +d.rape_revised;
        d.robbery = +d.robbery;
        d.aggravated_assault = +d.aggravated_assault;
        d.property_crime = +d.property_crime;
        d.burglary = +d.burglary;
        d.larceny = +d.larceny;
        d.motor_vehicle_theft = +d.motor_vehicle_theft;
    });
    crimeDS = data;
    genLineChart();
});

d3.csv("/data/vg/DataSet.csv").then(function (data) {
    // mouse hover event
    dispatch = d3.dispatch("vgEvent");
    dispatch.on("vgEvent", function (vg) {
        if (vgSelectedBar != null) {
            vgSelectedBar.attr("style", "stroke-width:0;stroke:rgb(0,0,0)");
            crimeSelectedDot.attr("r", lineChart.r);
        }
        vgSelectedBar = d3.selectAll("rect[Year=\'" + vg.Year + "\']");
        crimeSelectedDot = d3.select("circle[Year=\'" + vg.Year + "\']");
        crimeSelectedDot.attr("r", 5);
        vgSelectedBar.attr("style", "stroke-width:2;stroke:rgb(0,0,0)");
    })

    // convert from string to number
    data.forEach(function (d) {

        d.Action = +d.Action;
        d.Action_Adventure = +d.Action_Adventure;
        d.Adventure = +d.Adventure;
        d.Board_Game = +d.Board_Game;
        d.Education = +d.Education;
        d.Fighting = +d.Fighting;
        d.Misc = +d.Misc;
        d.MMO = +d.MMO;
        d.Music = +d.Music;
        d.Party = +d.Party;
        d.Platform = +d.Platform;
        d.Puzzle = +d.Puzzle;
        d.Racing = +d.Racing;
        d.Role_Playing = +d.Role_Playing;
        d.Sandbox = +d.Sandbox;
        d.Shooter = +d.Shooter;
        d.Simulation = +d.Simulation;
        d.Sports = +d.Sports;
        d.Strategy = +d.Strategy;
        d.Visual_Novel = +d.Visual_Novel;
        d.Total = +d.Total;
    });
    vgDS = data;
    gen_barChart();
    gen_timeline();
});


function genreSelector() {
    vgSelectedGenre = document.getElementById("dropdownbox").value;
    console.log(colorDict[vgSelectedGenre]);

    document.getElementById("dropdownbox").setAttribute("style", "background-color:" + colorDict[vgSelectedGenre]);
    update_barChart();
}

function crimeSelector() {
    selectedCrimeType = document.getElementById("crimeSelector").value;
    console.log(selectedCrimeType);
    update_lineChart();
}

function update_barChart() {
    //console.log("barchart update is called!\n year filers:");
    //console.log(year_filters);
    //console.log("genre");
    //console.log(vgSelectedGenre);

    //console.log(barchart.data);
    barchart.data = vgDS.filter(function (d) {
        return (d.Year >= year_filters[0] && d.Year <= year_filters[1])
    })
    //console.log(barchart.data);

    barchart.xAxis = d3.axisBottom()
        .scale(d3.scaleLinear()
            .domain([barchart.data[0].Year, barchart.data[barchart.data.length - 1].Year])
            .range([barchart.padding + barchart.bar_w / 2, barchart.w - barchart.padding - barchart.bar_w / 2]))
        .tickFormat(d3.format("d"))
        .ticks(vgDS.length);

    barchart.svg.remove();

    gen_barChart();

    /*  barchart.svg.select(".xAxis").transition().duration(750)
         .call(d3.axisBottom(barchart.xScale));

     barchart.svg.select(".yAxis").transition().duration(750)
         .call(d3.axisLeft(barchart.yScale)); */

    /* var padding = 40;
    var bar_w = 20;
    var w = 1500;
    var h = 200;
    var svg = d3.select("#barchart");
    svg.selectAll("rect") // same code, but now we only change values
        .data(vgDS.filter(function (d) {
            return (d.Year >= year_filters[0] && d.Year <= year_filters[1])
        }))
        .transition() // add a smooth transition
        .duration(1000);
    var xaxis = d3.axisBottom();
    xaxis.scale(d3.scaleLinear()
        .domain([vgDS[0].Year, vgDS[vgDS.length - 1].Year])
        .range([padding + bar_w / 2, w - padding - bar_w / 2]));
    d3.select(".xaxis")
        .call(xaxis); */
}

function update_lineChart() {
    /* lineChart.data = vgDS.filter(function (d) {
        return (d.Year >= year_filters[0] && d.Year <= year_filters[1] && d.state_abbr == selectedState)
    })

    lineChart.xAxis = d3.axisBottom()
        .scale(d3.scaleLinear()
            .domain([barchart.data[0].Year, barchart.data[barchart.data.length - 1].Year])
            .range([barchart.padding + barchart.bar_w / 2, barchart.w - barchart.padding - barchart.bar_w / 2]))
        .tickFormat(d3.format("d"))
        .ticks(vgDS.length); */

    lineChart.svg.remove();
    genLineChart();
}

var barchart = {
    data: 0,

    margin: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },

    // initialize with trash values!
    width: 0,
    height: 0,
    linewidth: 2,

    // initialize with huge values
    xMin: 10000.0,
    xMax: -10000.0,
    yMin: 10000.0,
    yMax: -10000.0,

    // initialize with trash values!
    xScale: 0,
    yScale: 0,
    maxXValue: 0,
    svg: 0
};

function gen_barChart() {
    barchart.w = 1500;
    barchart.h = 270;

    barchart.data = vgDS.filter(function (d, key) {
        //return key=="Year"||key=="Total"||key==vgSelectedGenre;
        return (d.Year >= year_filters[0] && d.Year <= year_filters[1])
    })
    console.log(barchart.data);

    barchart.svg = d3.select("#barchart")
        .append("svg")
        .attr("width", barchart.w)
        .attr("height", barchart.h);

    barchart.svg.append("text")
        .attr("class", "title")
        .attr("transform", "translate(700,30)")
        .text("Video Games per Year");


    barchart.padding = 40;
    barchart.bar_w = 20;

    barchart.yMax = d3.max(barchart.data, function (d) {
        return +d.Total;
    })

    barchart.yScale = d3.scaleSqrt()
        .domain([barchart.yMax, 0])
        .range([barchart.padding, barchart.h - barchart.padding]);

    barchart.xScale = d3.scaleLinear()
        .domain([0, barchart.data.length])
        .range([barchart.padding, barchart.w - barchart.padding]);

    barchart.yAxis = d3.axisLeft()
        .scale(barchart.yScale)
        .ticks(5);

    barchart.xAxis = d3.axisBottom()
        .scale(d3.scaleLinear()
            .domain([barchart.data[0].Year, barchart.data[barchart.data.length - 1].Year])
            .range([barchart.padding + barchart.bar_w / 2, barchart.w - barchart.padding - barchart.bar_w / 2]))

        .tickFormat(d3.format("d"))
        .ticks(barchart.data.length);

    barchart.svg.append("g")
        .attr("transform", "translate(40,0)")
        .attr("class", "y axis")
        .call(barchart.yAxis);

    barchart.svg.append("g")
        .attr("transform", "translate(0," + (barchart.h - barchart.padding) + ")")
        .call(barchart.xAxis);

    barchart.svg.selectAll("rect")
        .data(barchart.data)
        .enter().append(function (d, i) {
            var rects = document.createElementNS('http://www.w3.org/2000/svg', 'g');

            var rect1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect1.setAttribute('width', Math.floor((barchart.w - barchart.padding * 2) / barchart.data.length) - 1);
            rect1.setAttribute('height', barchart.h - barchart.padding - barchart.yScale(d.Total));
            rect1.setAttribute('x', barchart.xScale(i));
            rect1.setAttribute('y', barchart.yScale(d.Total));
            rect1.setAttribute("fill", d3.schemeCategory10[0]);
            rect1.setAttribute("Year", d.Year);
            rects.appendChild(rect1);

            var genre = getGenre(vgSelectedGenre, d);

            var rect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect2.setAttribute('width', Math.floor((barchart.w - barchart.padding * 2) / barchart.data.length) - 1);
            rect2.setAttribute('height', barchart.h - barchart.padding - barchart.yScale(genre));
            rect2.setAttribute('x', barchart.xScale(i));
            rect2.setAttribute('y', barchart.yScale(genre));
            rect2.setAttribute("fill", colorDict[vgSelectedGenre]);
            rect2.setAttribute("Year", d.Year);
            rects.appendChild(rect2);

            return rects;
        })
        .on("mouseover", function (d) {
            //tooltip.style("display", null);
            dispatch.call("vgEvent", d, d);
        })

}

/* var tooltip = barchart.svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");
    
tooltip.append("rect")
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold"); */

function gen_timeline() {
    var margin = {
            left: 170,
            right: 30
        },
        width = 1600,
        height = 60,
        range = [1979, 2016],
        step = 1; // change the step and if null, it'll switch back to a normal slider


    var svg = d3.select('#timeline')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var slider = svg.append("g")
        .classed('slider', true)
        .attr('transform', 'translate(' + margin.left + ', ' + (height / 2) + ')');

    /**/

    // using clamp here to avoid slider exceeding the range limits
    var xScale = d3.scaleLinear()
        .domain(range)
        .range([0, width - margin.left - margin.right])
        .clamp(true);

    // array useful for step sliders
    var rangeValues = d3.range(range[0], range[1], step || 1).concat(range[1]);

    var xAxis = d3.axisBottom(xScale).tickValues(rangeValues).tickFormat(function (d) {
        return d;
    });

    xScale.clamp(true);

    // this is the main bar with a stroke (applied through CSS)
    var track = slider.append('line').attr('class', 'track')
        .attr('x1', xScale.range()[0])
        .attr('x2', xScale.range()[1]);

    // this is a bar (steelblue) that's inside the main "track" to make it look like a rect with a border
    var trackInset = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-inset');

    var trackInterval = slider.append('line').attr('class', 'track-interval')
        .attr('x1', xScale.range()[0])
        .attr('x2', xScale.range()[1]);

    var ticks = slider.append('g').attr('class', 'ticks').attr('transform', 'translate(0, 4)')
        .call(xAxis);

    // drag handles
    var minHandle = slider.append('circle').classed('handle', true)
        .attr('r', 12)
        .attr("id", "minHandle")
        .on("mouseover", function (d) {
            d3.select(this).style("cursor", "pointer");
        })
        .on("mouseout", function (d) {
            d3.select(this).style("cursor", "default");
        });

    var maxHandle = slider.append('circle').classed('handle', true)
        .attr('r', 8)
        .attr("id", "maxHandle")
        .on("mouseover", function (d) {
            d3.select(this).style("cursor", "pointer");
        })
        .on("mouseout", function (d) {
            d3.select(this).style("cursor", "default");
        });;

    // optional initial transition
    /** /
    slider.transition().duration(750)
        .tween("drag", function () {
            var i = d3.interpolate(1985, 2005);
            return function (t) {
                dragged(xScale(i(t)));
            }
        });
    /**/

    //min starts at first year
    minHandle.attr('cx', xScale(1979));

    //max starts at latest year
    maxHandle.attr('cx', xScale(2016));

    // drag behavior initialization
    var drag = d3.drag()
        .on('start.interrupt', function () {
            slider.interrupt();
        })
        .on('start', function () {
            selectHandle(d3.event.x);
        })
        .on('drag', function () {
            dragging(d3.event.x);
            //update_linechart();
        })
        .on('end', function () {
            d3.select("#treemap").selectAll("*").remove();
            d3.select("#heatmap").selectAll("*").remove();
            //d3.select("#linechart").selectAll("*").remove();
            update_barChart();
            update_lineChart();
        });;

    // this is the bar on top of above tracks with stroke = transparent and on which the drag behaviour is actually called
    // try removing above 2 tracks and play around with the CSS for this track overlay, you'll see the difference
    var trackOverlay = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-overlay')
        .call(drag);

    var handleInUse;

    function selectHandle(value) {
        var minPos = minHandle.attr('cx');
        var maxPos = maxHandle.attr('cx');

        var x = xScale.invert(value),
            index = null,
            midPoint, cx, xVal;
        if (step) {
            // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
            for (var i = 0; i < rangeValues.length - 1; i++) {
                if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
                    index = i;
                    break;
                }
            }
            midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
            if (x < midPoint) {
                cx = xScale(rangeValues[index]);
                xVal = rangeValues[index];
            } else {
                cx = xScale(rangeValues[index + 1]);
                xVal = rangeValues[index + 1];
            }
        } else {
            // if step is null or 0, return the drag value as is
            cx = xScale(x);
            xVal = x.toFixed(3);
        }

        if (year_filters[0] == 1979 && year_filters[0] == year_filters[1])
            handleInUse = maxHandle;
        else if (year_filters[1] == 2016 && year_filters[0] == year_filters[1])
            handleInUse = minHandle;
        else
            handleInUse = Math.abs(minPos - cx) < Math.abs(maxPos - cx) ? minHandle : maxHandle;
    }

    function dragging(value) {
        var x = xScale.invert(value),
            index = null,
            midPoint, cx, xVal;
        if (step) {
            // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
            for (var i = 0; i < rangeValues.length - 1; i++) {
                if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
                    index = i;
                    break;
                }
            }
            midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
            if (x < midPoint) {
                cx = xScale(rangeValues[index]);
                xVal = rangeValues[index];
            } else {
                cx = xScale(rangeValues[index + 1]);
                xVal = rangeValues[index + 1];
            }
        } else {
            // if step is null or 0, return the drag value as is
            cx = xScale(x);
            xVal = x.toFixed(0);
        }
        // use xVal as drag value, e.g YEAR
        if (handleInUse == minHandle) {
            cx = clamp(cx, xScale(1979), maxHandle.attr('cx'));
            xVal = clamp(xVal, 1979, year_filters[1]);
            year_filters[0] = xVal;
        } else {
            cx = clamp(cx, minHandle.attr('cx'), xScale(2016));
            xVal = clamp(xVal, year_filters[0], 2016);
            year_filters[1] = xVal;
        }

        handleInUse.attr('cx', cx);

        trackInterval
            .attr('x1', minHandle.attr('cx'))
            .attr('x2', maxHandle.attr('cx'));
    }
}

function getGenre(name, d) {
    var genre;
    switch (name) {
        case "Action":
            genre = d.Action
            break;
        case "Action_Adventure":
            genre = d.Action_Adventure
            break;
        case "Adventure":
            genre = d.Adventure
            break;
        case "Board_Game":
            genre = d.Board_Game
            break;
        case "Education":
            genre = d.Education
            break;
        case "Fighting":
            genre = d.Fighting
            break;
        case "Misc":
            genre = d.Misc
            break;
        case "MMO":
            genre = d.MMO
            break;
        case "Music":
            genre = d.Music
            break;
        case "Party":
            genre = d.Party
            break;
        case "Platform":
            genre = d.Platform
            break;
        case "Puzzle":
            genre = d.Puzzle
            break;
        case "Racing":
            genre = d.Racing
            break;
        case "Role_Playing":
            genre = d.Role_Playing
            break;
        case "Sandbox":
            genre = d.Sandbox
            break;
        case "Shooter":
            genre = d.Shooter
            break;
        case "Simulation":
            genre = d.Simulation
            break;
        case "Sports":
            genre = d.Sports
            break;
        case "Strategy":
            genre = d.Strategy
            break;
        case "Visual_Novel":
            genre = d.Visual_Novel
            break;

        default:
            genre = d.Action;
            break;
    }
    return genre;
}
var lineChart = {
    data: 0,

    margin: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },

    // initialize with trash values!
    width: 0,
    height: 0,
    linewidth: 2,

    // initialize with huge values
    xMin: 10000.0,
    xMax: -10000.0,
    yMin: 10000.0,
    yMax: -10000.0,

    // initialize with trash values!
    xScale: 0,
    yScale: 0,
    maxXValue: 0,
    svg: 0
};

function genLineChart() {

    lineChart.w = 1500;
    lineChart.h = 200;

    lineChart.svg = d3.select("#linechart")
        .append("svg")
        .attr("width", lineChart.w)
        .attr("height", lineChart.h);

    lineChart.svg.append("text")
        .attr("class", "title")
        .attr("transform", "translate(700,40)")
        .text(crimeNameDic[selectedCrimeType] + " in " + stateDir[selectedState]);

    console.log(crimeDS);

    lineChart.data = crimeDS.filter(function (d, key) {
        //return key=="Year"||key=="Total"||key==vgSelectedGenre;
        return (d.Year >= year_filters[0] && d.Year <= year_filters[1] && d.state_abbr == selectedState /*  (d.state_abbr == selectedStates[0] || d.state_abbr == selectedStates[1] || d.state_abbr == selectedStates[2]) */ )
    })
    console.log(lineChart.data);

    lineChart.padding = 40;
    lineChart.bar_w = 20;
    lineChart.r = 2;

    lineChart.yMax = d3.max(lineChart.data, function (d) {
        return getCrimeMax(selectedCrimeType, d)
    })

    lineChart.yScale = d3.scaleLinear()
        .domain([lineChart.yMax, 0])
        .range([lineChart.padding, lineChart.h - lineChart.padding]);

    lineChart.xScale = d3.scaleLinear()
        .domain([0, lineChart.data.length])
        .range([lineChart.padding, lineChart.w - lineChart.padding]);

    lineChart.yAxis = d3.axisLeft()
        .scale(lineChart.yScale)
        .ticks(4);

    lineChart.xAxis = d3.axisBottom()
        .scale(d3.scaleLinear()
            .domain([lineChart.data[0].Year, lineChart.data[lineChart.data.length - 1].Year])
            .range([lineChart.padding + lineChart.bar_w / 2, lineChart.w - lineChart.padding - lineChart.bar_w / 2]))
        .tickFormat(d3.format("d"))
        .ticks(lineChart.data.length);

    lineChart.svg.append("g")
        .attr("transform", "translate(40,0)")
        .attr("class", "y axis")
        .call(lineChart.yAxis);

    lineChart.svg.append("g")
        .attr("transform", "translate(0," + (lineChart.h - lineChart.padding) + ")")
        .call(lineChart.xAxis);


    lineChart.svg.selectAll("circle")
        .data(lineChart.data)
        .enter().append("circle")
        .attr("r", lineChart.r)
        .attr("fill", function (d) {
            return "blue";
        })
        .attr("year", function (d) {
            return d.Year;
        })
        .attr("cx", function (d, i) {
            return lineChart.xScale(i); //TODO maybe d.Year
        })
        .attr("cy", function (d) {
            var crime = getCrime(selectedCrimeType, d);
            return lineChart.yScale(crime);
        })
        .on("mouseover", function (d) {
            //tooltip.style("display", null);
            dispatch.call("vgEvent", d, d);
        })
    /* .attr("title", function (d) {
        return d.title;
    }); */
}

function getCrime(name, d) {
    var crime;
    switch (name) {
        case "violent_crime":
            crime = d.violent_crime
            break;
        case "homicide":
            crime = d.homicide
            break;
        case "rape_legacy":
            crime = d.rape_legacy
            break;
        case "robbery":
            crime = d.robbery
            break;
        case "aggravated_assault":
            crime = d.aggravated_assault
            break;
        case "property_crime":
            crime = d.property_crime
            break;
        case "burglary":
            crime = d.burglary
            break;
        case "larceny":
            crime = d.larceny
            break;
        case "motor_vehicle_theft":
            crime = d.motor_vehicle_theft
            break;
        default:
            crime = d.violent_crime;
            break;
    }
    //console.log(crime);
    return crime;
}

function getCrimeMax(name, d) {
    var crime;
    switch (name) {
        case "violent_crime":
            crime = +d.violent_crime
            break;
        case "homicide":
            crime = +d.homicide
            break;
        case "rape_legacy":
            crime = +d.rape_legacy
            break;
        case "robbery":
            crime = +d.robbery
            break;
        case "aggravated_assault":
            crime = +d.aggravated_assault
            break;
        case "property_crime":
            crime = +d.property_crime
            break;
        case "burglary":
            crime = +d.burglary
            break;
        case "larceny":
            crime = +d.larceny
            break;
        case "motor_vehicle_theft":
            crime = +d.motor_vehicle_theft
            break;
        default:
            crime = +d.violent_crime;
            break;
    }
    //console.log(crime);
    return crime;
}

//------------------------

/* var cloudWords = [{
    word: "A",
    size: "10"
}, {
    word: "B",
    size: "20"
}, {
    word: "C",
    size: "50"
}, {
    word: "D",
    size: "30"
}, {
    word: "E",
    size: "60"
}];
var i = 0;
d3.csv("/data/ms/selectedMassShootingsClean.csv").then(function (data) {

    data.forEach(function (d) {
        if (i < 5) {
            cloudWords[i] = {
                word: d.Title,
                size: "10"
            };
            i++;
        }

    });

    //gen_WordCloud();
});

function gen_WordCloud() {

    // List of words
    var myWords = cloudWords; //[{word: "Running", size: "10"}, {word: "Surfing", size: "20"}, {word: "Climbing", size: "50"}, {word: "Kiting", size: "30"}, {word: "Sailing", size: "20"}, {word: "Snowboarding", size: "60"} ]

    // set the dimensions and margins of the graph
    var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#wordcloud").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function (d) {
            return {
                text: d.word,
                size: d.size
            };
        }))
        .padding(5) //space between words
        .rotate(function () {
            return ~~(Math.random() * 2) * 90;
        })
        .fontSize(function (d) {
            return d.size;
        }) // font size of words
        .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
        svg
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) {
                return d.size;
            })
            .style("fill", "#69b3a2")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) {
                return d.text;
            });
    } */