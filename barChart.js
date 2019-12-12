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

var genreTextDic = {}
genreTextDic["Action"] = "Action";
genreTextDic["Action_Adventure"] = "Action Adventure";
genreTextDic["Adventure"] = "Adventure";
genreTextDic["Board_Game"] = "Board Game";
genreTextDic["Education"] = "Education";
genreTextDic["Fighting"] = "Fighting";
genreTextDic["Misc"] = "Misc";
genreTextDic["MMO"] = "MMO";
genreTextDic["Music"] = "Music";
genreTextDic["Party"] = "Party";
genreTextDic["Platform"] = "Platform";
genreTextDic["Puzzle"] = "Puzzle";
genreTextDic["Racing"] = "Racing";
genreTextDic["Role_Playing"] = "Role Playing";
genreTextDic["Sandbox"] = "Sandbox";
genreTextDic["Shooter"] = "Shooter";
genreTextDic["Simulation"] = "Simulation";
genreTextDic["Sports"] = "Sports";
genreTextDic["Strategy"] = "Strategy";
genreTextDic["Visual_Novel"] = "Visual Novel";

d3.csv("/data/vg/DataSet.csv").then(function (data) {
    // mouse hover event
    dispatch = d3.dispatch("yearEvent");
    dispatch.on("yearEvent", function (vg) {
        if (vgSelectedBar != null) {
            if (vg.Year != barchart.selectedGameYear)
                vgSelectedBar.attr("style", "stroke-width:0.5;stroke:rgb(0,0,0)");
            else
                vgSelectedBar.attr("style", "stroke-width:3;stroke:rgb(255,0,0)");

            crimeSelectedDot.attr("r", lineChart.r);
            crimeSelectedDot.attr("style", "stroke-width:0;stroke:rgb(0,0,0)");
        }
        vgSelectedBar = d3.selectAll("rect[Year=\'" + vg.Year + "\']");

        if (vg.Year != barchart.selectedGameYear)
            vgSelectedBar.attr("style", "stroke-width:3;stroke:rgb(0,0,0)");
        else
            vgSelectedBar.attr("style", "stroke-width:3;stroke:rgb(255,0,0)");

        crimeSelectedDot = d3.selectAll("circle.dot[Year=\'" + vg.Year + "\']");
        crimeSelectedDot.attr("r", 6);
        crimeSelectedDot.attr("style", "stroke-width:3;stroke:rgb(0,0,0)");

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
    //console.log(colorDict[vgSelectedGenre]);

    //document.getElementById("dropdownbox").setAttribute("style", "background-color:" + colorDict[vgSelectedGenre]);
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
        top: 20,
        right: 5,
        bottom: 20,
        left: 5
    },
    w: 0,
    h: 0,
    padding: 40,
    r: 3,
    bar_w: 20,
    selectedGameName: null,
    selectedGameYear: 0
};

var barchartTooltipDiv;

function gen_barChart() {

    barchart.w = window.innerWidth - barchart.margin.left - barchart.margin.right;
    barchart.h = (window.innerHeight / 2 - 85) / 2 - barchart.margin.top - barchart.margin.bottom - 15; // Use the window's height

    barchart.padding = 40;

    barchart.data = vgDS.filter(function (d, key) {
        //return key=="Year"||key=="Total"||key==vgSelectedGenre;
        return (d.Year >= year_filters[0] && d.Year <= year_filters[1])
    })
    //console.log(barchart.data);

    barchart.bar_w = Math.floor((barchart.w - barchart.padding * 2) / barchart.data.length) - 10;
    //console.log(barchart.bar_w);

    barchart.svg = d3.select("#barchart")
        .append("svg")
        .attr("width", barchart.w)
        .attr("height", barchart.h);

    barchart.svg.append("text")
        .attr("class", "title")
        .attr("transform", "translate(" + (barchart.w / 2) + ",13)")
        .attr("text-anchor", "middle")
        .text("New Video Games per year");

    barchart.yMax = d3.max(barchart.data, function (d) {
        return +d.Total;
    })

    barchart.yScale = d3.scaleSqrt()
        .domain([barchart.yMax, 0])
        .range([barchart.margin.top, barchart.h - barchart.margin.bottom]);

    barchart.xScale = d3.scaleLinear()
        .domain([0, barchart.data.length - 1])
        .range([barchart.padding + barchart.bar_w / 2, barchart.w - barchart.padding - barchart.bar_w / 2]);
    //console.log(barchart.padding + barchart.bar_w / 2);



    barchart.yAxis = d3.axisLeft()
        .scale(barchart.yScale)
        .tickFormat(function (d) {
            if ((d / 1000) >= 1) {
                d = d / 1000 + "K";
            }
            return d;
        })
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
        .attr("transform", "translate(0," + (barchart.h - barchart.margin.bottom) + ")")
        .call(barchart.xAxis);

    barchartTooltipDiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    /* 
        if (barchart.selectedGameName != null) {
            barchart.svg.append("line")
                .attr("x1",  barchart.xScale(barchart.selectedGameYear - year_filters[0]) + barchart.bar_w/2) 
                .attr("y1", 0)
                .attr("x2",barchart.xScale(barchart.selectedGameYear - year_filters[0]) + barchart.bar_w/2)  
                .attr("y2", 20)
                .style("stroke-width", 2)
                .style("stroke", "red")
                .style("fill", "none");
        } */

    barchart.svg.selectAll("rect")
        .data(barchart.data)
        .enter().append(function (d, i) {
            var rects = document.createElementNS('http://www.w3.org/2000/svg', 'g');

            var rect1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect1.setAttribute('width', barchart.bar_w);
            rect1.setAttribute('height', barchart.h - barchart.margin.bottom - barchart.yScale(d.Total));
            rect1.setAttribute('x', barchart.xScale(i) - barchart.bar_w / 2);
            rect1.setAttribute('y', barchart.yScale(d.Total));
            rect1.setAttribute("fill", d3.schemeCategory10[0]);
            rect1.setAttribute("Year", d.Year);
            if (d.Year == barchart.selectedGameYear) {
                rect1.setAttribute("style", "stroke-width:2;stroke:rgb(255,0,0)");
            }
            else {
                rect1.setAttribute("style", "stroke-width:0.5;stroke:rgb(0,0,0)");
            }
            rects.appendChild(rect1);

            var genre = getGenre(vgSelectedGenre, d);

            var rect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect2.setAttribute('width', barchart.bar_w);
            rect2.setAttribute('height', barchart.h - barchart.margin.bottom - barchart.yScale(genre));
            rect2.setAttribute('x', barchart.xScale(i) - barchart.bar_w / 2);
            rect2.setAttribute('y', barchart.yScale(genre));
            //console.log(vgSelectedGenre);

            rect2.setAttribute("fill","rgb(188, 208, 238)");
            rect2.setAttribute("Year", d.Year);
            rects.appendChild(rect2);
            if (d.Year == barchart.selectedGameYear) {
                rect2.setAttribute("style", "stroke-width:2;stroke:rgb(255,0,0)");
            }
            else {
                rect2.setAttribute("style", "stroke-width:0.5;stroke:rgb(0,0,0)");
            }

            return rects;
        })
        .on("mouseover", function (d, i) {
            barchartTooltipDiv.transition()
                .duration(200)
                .style("opacity", .9);
            barchartTooltipDiv.html(d.Year + "<br/>" + "Total:" + d.Total + "<br/>" + genreTextDic[vgSelectedGenre] + getGenre(vgSelectedGenre, d))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            dispatch.call("yearEvent", d, d);
        })
        .on("mouseout", function (d) {
            barchartTooltipDiv.transition()
                .duration(500)
                .style("opacity", 0);
            dispatch.call("yearEvent", 0, 0);
        })

    //LEGEND

    barchart.svg.append("rect")
        .attr("x", barchart.w - 240)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", 15)
        .attr("style", "stroke-width:0.5;stroke:rgb(0,0,0)")
        .attr("fill", d3.schemeCategory10[0])
    barchart.svg.append("text")
        .attr("class", "title")
        .attr("x", barchart.w - 222)
        .attr("y", 14)
        .text("All genres");

    barchart.svg.append("rect")
        .attr("x", barchart.w - 148)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", 15)
        .attr("style", "stroke-width:0.5;stroke:rgb(0,0,0)")
        .attr("fill", "rgb(188, 208, 238)")
    barchart.svg.append("text")
        .attr("class", "title")
        .attr("x", barchart.w - 130)
        .attr("y", 14)
        .text(genreTextDic[vgSelectedGenre]);

    barchart.svg.append("text")
        .attr("x", 3)
        .attr("y", 13)
        //.attr("transform", "rotate(-90)")
        .style("text-anchor", "start")
        .attr("font-size", "15px")
        .text("Releases");

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