var vgTotalDS,
    vgGenreDS,
    vgSelectedBar = null,
    vgSelectedGenre = "Platform";

d3.csv("/data/vg/vgDATA.csv").then(function (data) {
    // mouse hover event
    /* dispatch = d3.dispatch("vgEvent");
    dispatch.on("vgEvent", function (vg) {
        if (vgSelectedBar != null) {
            vgSelectedBar.attr("fill", "purple");
        }
        console.log(vg.Year);
        vgSelectedBar = d3.select("rect[Year=\'" + vg.Year + "\']");
        vgSelectedBar.attr("fill", "red");
    }) */

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
        //console.log(d);
    });
    vgDS = data;
    //console.log(vgDS[0].Total);
    gen_bars1();
});


function gen_bars1() {
    var w = 1000;
    var h = 200;

    var svg = d3.select("#barchart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var padding = 40;
    var bar_w = 20;

    var maxCount = d3.max(vgDS, function (d) {
        return +d.Total;
    })

    var hscale = d3.scaleLinear()
        .domain([maxCount, 0])
        .range([padding, h - padding]);

    var xscale = d3.scaleLinear()
        .domain([0, vgDS.length])
        .range([padding, w - padding]);

    var yaxis = d3.axisLeft()
        .scale(hscale);

    var xaxis = d3.axisBottom()
        .scale(d3.scaleLinear()
            .domain([vgDS[0].Year, vgDS[vgDS.length - 1].Year])
            .range([padding + bar_w / 2, w - padding - bar_w / 2]))
        .tickFormat(d3.format("d"))
        .ticks(vgDS.length / 3);

    svg.append("g")
        .attr("transform", "translate(40,0)")
        .attr("class", "y axis")
        .call(yaxis);

    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xaxis);

    /* .on("mouseover", function (d) {
        dispatch.call("vgEvent", d, d);
    }) */
    svg.selectAll("rect")
        .data(vgDS)
        .enter().append(function (d, i) {
            var rects = document.createElementNS('http://www.w3.org/2000/svg', 'g');

            var rect1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect1.setAttribute('width', Math.floor((w - padding * 2) / vgDS.length) - 1);
            rect1.setAttribute('height', h - padding - hscale(d.Total));
            rect1.setAttribute('x', xscale(i));
            rect1.setAttribute('y', hscale(d.Total));
            rect1.setAttribute("fill", d3.schemeCategory10[0]);
            rects.appendChild(rect1);

            var genre;
            switch (vgSelectedGenre) {
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
                    genre = d.Shooter;
                    break;
            }

            var rect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect2.setAttribute('width', Math.floor((w - padding * 2) / vgDS.length) - 1);
            rect2.setAttribute('height', h - padding - hscale(genre));
            rect2.setAttribute('x', xscale(i));
            rect2.setAttribute('y', hscale(genre));
            rect2.setAttribute("fill", d3.schemeCategory10[1]);
            rects.appendChild(rect2);

            return rects;
        })
}



//------------------------

var cloudWords = [{word: "A", size: "10"},{word: "B", size: "20"},{word: "C", size: "50"},{word: "D", size: "30"},{word: "E", size: "60"}];
var i = 0;
d3.csv("/data/ms/selectedMassShootingsClean.csv").then(function (data) {
   
    data.forEach(function (d) {
                if(i < 5){
                   cloudWords[i] = {word: d.Title, size: "10"};
                i++; 
                }
                
    });

    gen_WordCloud();
});

function gen_WordCloud(){
    
// List of words
var myWords = cloudWords; //[{word: "Running", size: "10"}, {word: "Surfing", size: "20"}, {word: "Climbing", size: "50"}, {word: "Kiting", size: "30"}, {word: "Sailing", size: "20"}, {word: "Snowboarding", size: "60"} ]

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
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
  .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
  .padding(5)        //space between words
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .fontSize(function(d) { return d.size; })      // font size of words
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
        .style("font-size", function(d) { return d.size; })
        .style("fill", "#69b3a2")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}

}