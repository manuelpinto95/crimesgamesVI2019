var goldD = "#AF9500";
var goldL = "#C9B037";
var siloverD = "#B4B4B4";
var siloverL = "#D7D7D7";
var bronzeD = "#6A3805";
var bronzeL = "#AD8A56";
var podiumD = [goldD,siloverD,bronzeD];
var podiumL = [goldL,siloverL,bronzeL];

var top3svg;

var top3Tip;

d3.csv("/data/ms/MSselected2.csv").then(function (data) {
    //CONVERT STRINGS TO NUMBERS
    data.forEach(function (d) {
        d.Fatalities = +d.Fatalities;
        d.Injured = +d.Injured;
        d.Victims = +d.Victims;
        d.Year = +d.Year;
    });
    msTop3data = data;
    console.log(msTop3data);
    
    genTop3();
});

function genTop3() {
    var margin = {
        top: 10,
        right: 5,
        bottom: 5,
        left: 5
    };

    top3Tip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var w = 500 // Use the window's width 
    var h = 200; // Use the window's height

    top3svg = d3.select("#masslist")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var filteredData = msTop3data.filter(function (d, key) {
        if (countStates() == 0) {

            return (d.Year >= year_filters[0] && d.Year <= year_filters[1])
        } else {

            return (d.Year >= year_filters[0] && d.Year <= year_filters[1] && (d.state_abbr == states[0] || d.state_abbr == states[1] || d.state_abbr == states[2]))
        }
    })

    console.log(filteredData);

    filteredData.sort(function(x,y){
        return d3.descending(x.Fatalities,y.Fatalities);
    })

    


    var top3 = filteredData.slice(0, 3);

    console.log(top3);

    var max = 30

    xScale = d3.scaleLinear()
        .domain([0, max])
        .range([0, w]);


    /* for (let index = 0; index < top3.length; index++) {
        top3svg.append("rect")
        .attr("Year", top3[index].Year)
        .attr("fill",podiumD[index])
        .attr("width", xScale(top3[index].Fatalities))
        .attr("height", h / 3 - 6)
        .attr("x", 0 )
        .attr("y", index*h/3);
    } */
    

    for (let index = 0; index < top3.length; index++) {
        top3svg.append("rect")
        .attr("Year", top3[index].Year)
        .attr("style", "stroke-width:0.5;stroke:rgb(0,0,0)")
        .attr("fill",podiumL[index])
        .attr("width", w - 6/* xScale(max - top3[index].Fatalities) */)
        .attr("height", h / 3 - 6)
        .attr("x",  3 /* xScale(top3[index].Fatalities) */ )
        .attr("y", index*h/3)
        .on("mouseover", function (d, i) {
            barchartTooltipDiv.transition()
                .duration(200)
                .style("opacity", .9);
            var text = top3[index].Year + "<br/>" + "Fatalities:" + top3[index].Fatalities + "<br/>"+  top3[index].Desc;
            barchartTooltipDiv.html(text)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            dispatch.call("yearEvent", top3[index], top3[index]);
        })
        .on("mouseout", function (d) {
            barchartTooltipDiv.transition()
                .duration(500)
                .style("opacity", 0);
        });
    }

    for (let index = 0; index < top3.length; index++) {
        top3svg.append("text")
        .attr("x", 5 )
        .attr("y", index*h/3 + 27)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("#"+(index+1) + ":       " + top3[index].Title);
    }
}

function update_top3() {
    top3svg.remove();
    genTop3();
}