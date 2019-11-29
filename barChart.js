var vgTotal,
    vGGenreDS,
    vgAction,
    vgShooter,
    vgSelectedBar = null,
    vgSelectedGenre = "Action",
    crimeState,
    vgNames;

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

d3.csv("/data/vg/DataSet.csv").then(function (data) {
    // mouse hover event
    dispatch = d3.dispatch("vgEvent");
    dispatch.on("vgEvent", function (vg) {
        if (vgSelectedBar != null) {
            vgSelectedBar.attr("style", "stroke-width:0;stroke:rgb(0,0,0)");
            crimeSelectedDot.attr("r", lineChart.r);
            crimeSelectedDot.attr("style", "stroke-width:0;stroke:rgb(0,0,0)");
        }
        vgSelectedBar = d3.selectAll("rect[Year=\'" + vg.Year + "\']");
        crimeSelectedDot = d3.select("circle.dot[Year=\'" + vg.Year + "\']");
        crimeSelectedDot.attr("r", 6);
        crimeSelectedDot.attr("style", "stroke-width:2;stroke:rgb(0,0,0)");
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
var barchart = {
    data: 0,
    svg: 0,
    margin: {
        top: 1,
        right: 5,
        bottom: 1,
        left: 5
    },
    w: 0,
    h: 0,
    padding: 40,
    r: 3,
    bar_w: 20
};

function gen_barChart() {

    barchart.w = window.innerWidth - barchart.margin.left - barchart.margin.right // Use the window's width 
    barchart.h = window.innerHeight / 4 - barchart.margin.top - barchart.margin.bottom; // Use the window's height

    barchart.padding = 40;

    barchart.data = vgDS.filter(function (d, key) {
        //return key=="Year"||key=="Total"||key==vgSelectedGenre;
        return (d.Year >= year_filters[0] && d.Year <= year_filters[1])
    })
    //console.log(barchart.data);

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
            //console.log(vgSelectedGenre);
            
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