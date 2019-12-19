var goldD = "#AF9500";
var goldL = "#C9B037";
var siloverD = "#B4B4B4";
var siloverL = "#D7D7D7";
var bronzeD = "#6A3805";
var bronzeL = "#AD8A56";
var podiumD = [goldD, siloverD, bronzeD];
var podiumL = [goldL, siloverL, bronzeL];

var top3svg;

var top3Tip;

var msTop3data;

var selectedMScircle = null;
var selectedMSrect = null;

d3.csv("/data/ms/MS_top10.csv").then(function (data) {
    ms_dispatch = d3.dispatch("msEvent");
    ms_dispatch.on("msEvent", function (ms) {
        //console.log(ms.Year);
        //console.log(selectedGameYear);
        

        if (selectedMScircle != null) {
            selectedMScircle.attr("style", "stroke-width:0.5;stroke:rgb(0,0,0)");

            if (selectedGameYear != null && ms.Year == selectedGameYear)
                selectedMScircle.attr("fill", d3.schemeCategory10[3]); // red
            else
                selectedMScircle.attr("fill", d3.schemeSet1[5]); //normal
        }

        if (selectedMSrect != null) {

            if (selectedGameYear != null && ms.Year == selectedGameYear)
                selectedMSrect.attr("fill", d3.schemePastel1[0]); // red
            else
                selectedMSrect.attr("fill", "#E8E8E8"); // normal
        }

        if (ms == -1)
            return;

        selectedMScircle = d3.selectAll("circle.dot2[ID=\'" + ms.ID + "\']");

        selectedMScircle.attr("style", "stroke-width:1.5;stroke:rgb(0,0,0)");
        selectedMScircle.attr("fill", "rgb(165, 136, 42)");
        selectedMScircle.raise();

        selectedMSrect = d3.selectAll("rect[ID=\'" + ms.ID + "\']");

        selectedMSrect.attr("fill", d3.schemePastel1[6]);
    })

    //CONVERT STRINGS TO NUMBERS
    data.forEach(function (d) {
        d.ID = +d.ID;
        d.Fatalities = +d.Fatalities;
        d.Injured = +d.Injured;
        d.Victims = +d.Victims;
        d.Year = +d.Year;
        d.Latitude = +d.Latitude;
        d.Longitude = +d.Longitude
    });
    msTop3data = data;
    //console.log(msTop3data);

    genTop3();
});

function genTop3() {
    var margin = {
        top: 10,
        right: 5,
        bottom: 5,
        left: 5
    };

    var filteredData = msTop3data.filter(function (d, key) {
        if (countStates() == 0) {

            return (d.Year >= year_filters[0] && d.Year <= year_filters[1])
        } else {

            return (d.Year >= year_filters[0] && d.Year <= year_filters[1] && (d.state_abbr == states[0] || d.state_abbr == states[1] || d.state_abbr == states[2]))
        }
    })

    //console.log(filteredData);

    filteredData.sort(function (x, y) {
        return d3.descending(x.Victims, y.Victims);
    })

    var top3 = filteredData.slice(0, 10);

    document.getElementById("masslist").style.height = window.innerHeight / 2 - 160 - 60 - 40;

    top3Tip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var w = 481 // Use the window's width 
    var h = 60.5 * top3.length; // Use the window's height

    top3svg = d3.select("#masslist")
        .append("svg")
        .attr("width", w)
        .attr("height", h);


    //console.log(top3);
    var max = 0;
    if (filteredData.length > 0)
        max = filteredData[0].Victims;

    xScale = d3.scaleLinear()
        .domain([0, max])
        .range([0, w - 5]);


    /* for (let index = 0; index < top3.length; index++) {
        top3svg.append("rect")
        .attr("Year", top3[index].Year)
        .attr("Ttile", top3[index].Title)
        .attr("fill",podiumD[index])
        .attr("width", xScale(top3[index].Victims))
        .attr("height", h / 3 - 6)
        .attr("x", 0 )
        .attr("y", index*h/3);
    } */

    for (let index = 0; index < top3.length; index++) {
        top3svg.append("rect")
            .attr("Year", top3[index].Year)
            .attr("style", "stroke-width:0.5;stroke:rgb(0,0,0)")
            .attr("fill", /* index<3?podiumL[index]: */"white")
            .attr("width", xScale(max) - 5/* xScale(max - top3[index].Victims) */)
            .attr("height", 58)
            .attr("x", 3 /* xScale(top3[index].Victims) */)
            .attr("y", index * 60 + 2)
            .on("mousemove", function (d, i) {
                ms_dispatch.call("msEvent", top3[index], top3[index]);
            })
            .on("mouseout", function (d) {
                ms_dispatch.call("msEvent", 0, 0);
            });
    }

    for (let index = 0; index < top3.length; index++) {
        top3svg.append("rect")
            .attr("fill", "#E8E8E8")
            .attr("fill", function () {
                if (top3[index].Year != selectedGameYear) {
                    return "#E8E8E8"
                }
                else {
                    return d3.schemePastel1[0];
                }
            })
            .attr("ID", top3[index].ID)
            .attr("width", (xScale(top3[index].Victims) - 8 > 0 ? xScale(top3[index].Victims) - 8 : 0))
            .attr("height", 58 - 4)
            .attr("x", 5 /* xScale(top3[index].Victims) */)
            .attr("y", index * 60 + 4)
            .on("mousemove", function (d, i) {
                barchartTooltipDiv.transition()
                    .duration(200)
                    .style("opacity", .9);
                var text = "Victims: " + top3[index].Victims;
                barchartTooltipDiv.html(text)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY + 10) + "px");
                ms_dispatch.call("msEvent", top3[index], top3[index]);
            })
            .on("mouseout", function (d) {
                barchartTooltipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);
                ms_dispatch.call("msEvent", 0, 0);
            });
    }

    for (let index = 0; index < top3.length; index++) {
        top3svg.append("text")
            .attr("x", 8)
            .attr("y", index * 60 + 35)
            .attr("text-anchor", "start")
            .attr("font-weight", "normal")
            .style('fill', function () {
                var state = findState(top3[index].state_abbr)
                if (state != -1)
                    return statesColors[state];
                else
                    return "rgb(53, 88, 139)";
            })
            .text("#" + (index + 1) + ":       " + top3[index].Title)
            .on("mousemove", function (d, i) {
                barchartTooltipDiv.transition()
                    .duration(200)
                    .style("opacity", .9);
                var text = top3[index].Year + "<br/>" + "Victims:" + top3[index].Victims + "<br/>" + top3[index].Desc;
                barchartTooltipDiv.html(text)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY + 10) + "px");
                ms_dispatch.call("msEvent", top3[index], top3[index]);
            })
            .on("mouseout", function (d) {
                barchartTooltipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);
                ms_dispatch.call("msEvent", 0, 0);
            });
    }
}

function update_top3() {
    top3svg.remove();
    genTop3();
}