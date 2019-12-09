var crimeDS,
    selectedCrimeType = "violent_crime",
    statesColors = [d3.schemeDark2[0], d3.schemeDark2[1], d3.schemeDark2[2]],
    crimeSelectedDot = null;

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

var colorOfLines = [d3.schemeDark2[0], d3.schemeDark2[1], d3.schemeDark2[2]]

var stateDic = {
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

d3.csv("/data/crime/crimesoriginal.csv").then(function (data) {
    //CONVERT STRINGS TO NUMBERS
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

var lineChart = {
    data: 0,
    svg: 0,
    margin: {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
    },
    w: 0,
    h: 0,
    padding: 40,
    r: 3,
    bar_w: 20
}

function genLineChart() {

    lineChart.w = window.innerWidth - lineChart.margin.left - lineChart.margin.right // Use the window's width 
    lineChart.h = (window.innerHeight / 2 - 85)/2 - lineChart.margin.top - lineChart.margin.bottom - 15; // Use the window's height

    lineChart.padding = 40;
    lineChart.r = 4;

    lineChart.svg = d3.select("#linechart")
        .append("svg")
        .attr("width", lineChart.w)
        .attr("height", lineChart.h);

    lineChart.svg.append("text")
        .attr("class", "title")
        .attr("transform", "translate(" + (lineChart.w / 2 - 50) + ",40)")
        .text("Crime occurrences per 1000 capita");

    filterCrimeData()

    defineLineChartAxis()

    lineChart.svg.append("g")
        .attr("transform", "translate(40,0)")
        .attr("class", "y axis")
        .call(lineChart.yAxis);

    lineChart.svg.append("text")
        .attr("x", 62)
        .attr("y", 35)
        //.attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text(crimeNameDic[selectedCrimeType]);

    lineChart.svg.append("g")
        .attr("transform", "translate(-10," + (lineChart.h - lineChart.padding) + ")")
        .attr("class", "xaxis")
        .call(lineChart.xAxis);

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var numStates = countStates();
    if (numStates == 0) {
        lineChart.svg.append("circle")
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", lineChart.w - 60)
            .attr("cy", 20)
            .attr("r", 4)
            .attr("fill", d3.schemeDark2[3])
        lineChart.svg.append("text")
            .attr("class", "title")
            .attr("x", lineChart.w - 50)
            .attr("y", 20 + 4)
            .text("USA");
    }
    else {
        for (let index = 0; index < numStates; index++) {
            lineChart.svg.append("circle")
                .attr("class", "dot") // Assign a class for styling
                .attr("cx", lineChart.w - 60)
                .attr("cy", 20 * (index + 1))
                .attr("r", 4)
                .attr("fill", d3.schemeDark2[index])
            lineChart.svg.append("text")
                .attr("class", "title")
                .attr("x", lineChart.w - 50)
                .attr("y", 20 * (index + 1) + 4)
                .text(states[index]);
        }
    }

    var numStates = countStates();
    if (numStates == 0) {
        // Define lines
        var line = d3.line()
            .x(function (d, i) { return lineChart.xScale(i); }) // set the x values for the line generator
            .y(function (d) {
                var crime = getCrime(selectedCrimeType, d);
                var crimePerCapita = crime / d.population * 1000;
                return lineChart.yScale(crimePerCapita);
            }) // set the y values for the line generator 
            .curve(d3.curveMonotoneX) // apply smoothing to the line

        lineChart.svg.append("path")
            .datum(lineChart.data[0].values) // 10. Binds data to the line 
            .attr("class", "line") // Assign a class for styling 
            .attr("d", line) // 11. Calls the line generator
            .attr("stroke", d3.schemeDark2[3]);

        lineChart.svg.selectAll("dot")
            .data(lineChart.data[0].values)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function (d, i) { return lineChart.xScale(i); })
            .attr("cy", function (d) {
                var crime = getCrime(selectedCrimeType, d);
                crimePerCapita = crime / d.population * 1000;
                return lineChart.yScale(crimePerCapita);
            })
            .attr("r", 5)
            .attr("fill", d3.schemeDark2[3])
            .attr("Year", function (d) { return d.Year; })
            .on("mouseover", function (d, i) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.Year + "<br/>" + (getCrime(selectedCrimeType, d) / d.population * 1000).toFixed(3))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                dispatch.call("yearEvent", d, d);
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
    }
    else {
        for (let index = 0; index < numStates; index++) {
            // Define lines
            var line = d3.line()
                .x(function (d, i) { return lineChart.xScale(i); }) // set the x values for the line generator
                .y(function (d) {
                    var crime = getCrime(selectedCrimeType, d);
                    var crimePerCapita = crime / d.population * 1000;
                    return lineChart.yScale(crimePerCapita);
                }) // set the y values for the line generator 
                .curve(d3.curveMonotoneX) // apply smoothing to the line

            lineChart.svg.append("path")
                .datum(lineChart.data[index].values) // 10. Binds data to the line 
                .attr("class", "line") // Assign a class for styling 
                .attr("d", line) // 11. Calls the line generator
                .attr("stroke", colorOfLines[index]);

            lineChart.svg.selectAll("dot")
                .data(lineChart.data[index].values)
                .enter().append("circle") // Uses the enter().append() method
                .attr("class", "dot") // Assign a class for styling
                .attr("cx", function (d, i) { return lineChart.xScale(i); })
                .attr("cy", function (d) {
                    var crime = getCrime(selectedCrimeType, d);
                    var crimePerCapita = crime / d.population * 1000;
                    return lineChart.yScale(crimePerCapita);
                })
                .attr("r", 5)
                .attr("fill", colorOfLines[index])
                .attr("Year", function (d) { return d.Year; })
                .on("mouseover", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(d.Year + "<br/>" + (getCrime(selectedCrimeType, d) / d.population * 1000).toFixed(3))
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                    dispatch.call("yearEvent", d, d);
                })
                .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
        }
    }
}

function update_lineChart() {
    lineChart.svg.remove();
    genLineChart();
    /*filterCrimeData()
    defineLineChartAxis()
 
    var numStates = countStates();
 
    var path = lineChart.svg.selectAll("path.line")
        .data(lineChart.data);
    path.exit().remove();
 
 
    for (let index = 0; index < numStates; index++) {
        var circles = lineChart.svg.selectAll("circle")
            .data(lineChart.data[index].values)
        circles.exit().remove();
 
        circles
            .transition()
            .duration(1000)
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function (d, i) { return lineChart.xScale(i); })
            .attr("cy", function (d) {
                var crime = getCrime(selectedCrimeType, d);
                var crimePerCapita = crime / d.population * 1000;
                return lineChart.yScale(crimePerCapita);
            })
            .attr("r", 5)
            .attr("fill", colorOfLines[index])
            .attr("Year", function (d) { return d.Year; });
 
        var line = d3.line()
            .x(function (d, i) { return lineChart.xScale(i); }) // set the x values for the line generator
            .y(function (d) {
                var crime = getCrime(selectedCrimeType, d);
                var crimePerCapita = crime / d.population * 1000;
                return lineChart.yScale(crimePerCapita);
            }) // set the y values for the line generator 
            .curve(d3.curveMonotoneX) // apply smoothing to the line
 
        path
            .transition()
            .duration(1000);
            //.attr("class", "line") // Assign a class for styling 
            //.attr("d", line) // 11. Calls the line generator
            //.attr("stroke", colorOfLines[index]);
    } */

    /* lineChart.svg.append("path")
        .datum(entries[0].values) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator */

}

function defineLineChartAxis() {
    var ymax = 0;
    var numStates = countStates();
    if (numStates == 0) {
        lineChart.yMax = d3.max(lineChart.data[0].values, function (d) {
            return getCrimeMax(selectedCrimeType, d)
        })
    }
    else {
        var max;
        for (let index = 0; index < numStates; index++) {

            max = d3.max(lineChart.data[index].values, function (d) {
                return getCrimeMax(selectedCrimeType, d)
            })
            if (max > ymax)
                ymax = max
        }
        lineChart.yMax = ymax;
    }

    lineChart.yScale = d3.scaleLinear()
        .domain([lineChart.yMax, 0])
        .range([lineChart.padding, lineChart.h - lineChart.padding]);


    lineChart.xScale = d3.scaleLinear()
        .domain([0, lineChart.data[0].values.length])
        .range([lineChart.padding, lineChart.w - lineChart.padding]);

    lineChart.yAxis = d3.axisLeft()
        .scale(lineChart.yScale)
        .ticks(6)
        .tickFormat(function (d) {
            if ((d / 1000) >= 1) {
                d = d / 1000 + "K";
            }
            return d;
        });

    lineChart.xAxis = d3.axisBottom()
        .scale(d3.scaleLinear()
            .domain([lineChart.data[0].values[0].Year, lineChart.data[0].values[lineChart.data[0].values.length - 1].Year])
            .range([lineChart.padding + lineChart.bar_w / 2, lineChart.w - lineChart.padding - lineChart.bar_w / 2]))
        .tickFormat(d3.format("d"))
        .ticks(lineChart.data[0].values.length);
}

function crimeSelector() {
    selectedCrimeType = document.getElementById("crimeSelector").value;
    console.log(selectedCrimeType);
    update_lineChart();
}

function getStatesText() {
    if (countStates() == 0)
        return "the USA"
    else {
        var ret = "";
        for (var i = 0; i < 3; i++) {
            if (states[i] != "") {
                ret += states[i];
                ret += ", "
            }
        }
        return ret;
    }
}

function filterCrimeData() {
    var filteredData = crimeDS.filter(function (d, key) {
        if (countStates() == 0) {
            return (d.Year >= year_filters[0] && d.Year <= year_filters[1] && d.state_abbr == "the USA")
        } else {

            return (d.Year >= year_filters[0] && d.Year <= year_filters[1] && (d.state_abbr == states[0] || d.state_abbr == states[1] || d.state_abbr == states[2]))
        }
    })

    var entries = d3.nest()
        .key(function (d) { return d.state_abbr; })
        .entries(filteredData);

    lineChart.data = entries;
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
    var pop = d.population
    return crime / pop * 1000;
}