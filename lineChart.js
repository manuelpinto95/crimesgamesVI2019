var crimeDS,
    selectedCrimeType = "mass_shootings",
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
crimeNameDic["mass_shootings"] = "Mass shootings"

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

var codeDic = {
    "Alaska": "AK",
    "Alabama": "AL",
    "Arkansas": "AR",
    "Arizona": "AZ",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "District of Columbia": "DC",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Iowa": "IA",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Massachusetts": "MA",
    "Maryland": "MD",
    "Maine": "ME",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Missouri": "MO",
    "Mississippi": "MS",
    "Montana": "MT",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Nebraska": "NE",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "Nevada": "NV",
    "New York": "NY",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Puerto Rico": "PR",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Virginia": "VA",
    "Vermont": "VT",
    "Washington": "WA",
    "Wisconsin": "WI",
    "West Virginia": "WV",
    "Wyoming": "WY",
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
        top: 20,
        right: 5,
        bottom: 20,
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
    lineChart.h = (window.innerHeight / 2 - 85) / 2 - lineChart.margin.top - lineChart.margin.bottom - 15; // Use the window's height

    lineChart.padding = 40;
    lineChart.r = 4;

    lineChart.bar_w = Math.floor((lineChart.w - lineChart.padding * 2) / (year_filters[1] - year_filters[0] + 1)) - 10;
    //console.log(lineChart.bar_w);


    lineChart.svg = d3.select("#linechart")
        .append("svg")
        .attr("width", lineChart.w)
        .attr("height", lineChart.h);

    lineChart.svg.append("text")
        .attr("class", "title")
        .attr("font-size", "20px")
        .attr("transform", "translate(" + (lineChart.w / 2) + ",15)")
        .attr("text-anchor", "middle")
        .text(crimeNameDic[selectedCrimeType] + " over the years");

    filterCrimeData()

    defineLineChartAxis()

    lineChart.svg.append("g")
        .attr("transform", "translate(40,0)")
        .attr("class", "y axis")
        .call(lineChart.yAxis);

    var yLabel = selectedCrimeType != "mass_shootings" ? "Crime ocurrences per 1000 capita" : "Number of mass shootings";

    lineChart.svg.append("text")
        .attr("x", 3)
        .attr("y", 13)
        //.attr("transform", "rotate(-90)")
        .style("text-anchor", "start")
        .attr("font-size", "15px")
        .text(yLabel);


    lineChart.svg.append("g")
        .attr("transform", "translate(-10," + (lineChart.h - lineChart.margin.bottom) + ")")
        .attr("class", "xaxis")
        .call(lineChart.xAxis);

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var numStates = countStates();
    if (numStates == 0) {
        lineChart.svg.append("circle")
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", lineChart.w - 140)
            .attr("cy", 8)
            .attr("r", 4)
            .attr("style", "stroke-width:0.5;stroke:rgb(0,0,0)")
            .attr("fill", "rgb(53, 88, 139)")
        lineChart.svg.append("text")
            .attr("class", "title")
            .attr("x", lineChart.w - 130)
            .attr("y", 13)
            .text("USA");
    }
    else {
        for (let index = 0; index < numStates; index++) {
            lineChart.svg.append("circle")
                .attr("class", "dot") // Assign a class for styling
                .attr("cx", lineChart.w - 140 - 92 * index)
                .attr("cy", 8)
                .attr("r", 4)
                .attr("style", "stroke-width:0.5;stroke:rgb(0,0,0)")
                .attr("fill", d3.schemeDark2[index])
            lineChart.svg.append("text")
                .attr("class", "title")
                .attr("x", lineChart.w - 130 - 92 * index)
                .attr("y", 13)
                .text(states[index]);
        }
    }

    var numStates = countStates();
    if (numStates == 0) {
        // Define lines
        var line = d3.line()
            .x(function (d, i) { return lineChart.xScale(i); }) // set the x values for the line generator
            .y(function (d) {
                return lineChart.yScale(getCrime(selectedCrimeType, d));
            }) // set the y values for the line generator 
            .curve(d3.curveMonotoneX) // apply smoothing to the line

        lineChart.svg.append("path")
            .datum(lineChart.data[0].values) // 10. Binds data to the line 
            .attr("class", "line") // Assign a class for styling 
            .attr("d", line) // 11. Calls the line generator
            .attr("stroke", "rgb(53, 88, 139)");

        lineChart.svg.selectAll("dot")
            .data(lineChart.data[0].values)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function (d, i) { return lineChart.xScale(i); })
            .attr("cy", function (d) {
                return lineChart.yScale(getCrime(selectedCrimeType, d));
            })
            .attr("r", 5)
            .attr("fill", function(d) {
                if (d.Year != selectedGameYear) {
                    return "rgb(53, 88, 139)"  
                }
                else {
                    return d3.schemeCategory10[3];
                } 
            })
            .attr("Year", function (d) { return d.Year.trim(); })
            .on("mousemove", function (d, i) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);

                div.html("USA" + "<br/>" + d.Year + "<br/>" + Number(getCrime(selectedCrimeType, d)).toFixed(3))
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY + 10) + "px");

                dispatch.call("yearEvent", d, d);
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
                dispatch.call("yearEvent", 0, 0);
            })
    }
    else {
        for (let index = 0; index < numStates; index++) {
            // Define lines
            var line = d3.line()
                .x(function (d, i) { return lineChart.xScale(i); }) // set the x values for the line generator
                .y(function (d) {
                    return lineChart.yScale(getCrime(selectedCrimeType, d));
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
                    return lineChart.yScale(getCrime(selectedCrimeType, d));
                })
                .attr("r", 5)
                .attr("fill", function(d) {
                    if (d.Year != selectedGameYear) {
                        return colorOfLines[index]  
                    }
                    else {
                        return d3.schemeCategory10[3];
                    } 
                })
                .attr("Year", function (d) { return d.Year.trim(); })
                .on("mousemove", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);

                    div.html(d.state_abbr + "<br/>" + d.Year + "<br/>" + Number(getCrime(selectedCrimeType, d)).toFixed(3))
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY + 10) + "px");

                    dispatch.call("yearEvent", d, d);
                })
                .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                    dispatch.call("yearEvent", 0, 0);
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
            .attr("Year", function (d) { return d.Year.trim(); });
 
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
        .range([lineChart.margin.top, lineChart.h - lineChart.margin.bottom]);


    lineChart.xScale = d3.scaleLinear()
        .domain([0, lineChart.data[0].values.length - 1])
        .range([lineChart.padding + lineChart.bar_w / 2, lineChart.w - lineChart.padding - lineChart.bar_w / 2]);

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
            .domain([year_filters[0], year_filters[1]])
            .range([lineChart.padding + lineChart.bar_w / 2 + 10, lineChart.w - lineChart.padding - lineChart.bar_w / 2 + 10]))
        .tickFormat(d3.format("d"))
        .ticks(year_filters[1] - year_filters[0] + 1);

    //console.log(year_filters[1] - year_filters[0] + 1);

}

function crimeSelector() {
    selectedCrimeType = document.getElementById("crimeSelector").value;
    //console.log(selectedCrimeType);
    update_lineChart();
    update_map();
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
    console.log(filteredData);

    var entries = d3.nest()
        .key(function (d) { return d.state_abbr; })
        .entries(filteredData);


    entries.sort(function (x, y) {
        return d3.ascending(findState(x.key), findState(y.key));
    })
    console.log(entries);

    lineChart.data = entries;

}

function getCrime(name, d) {
    var crime;
    switch (name) {
        case "mass_shootings":
            crime = d.mass_shootings
            break;
        case "violent_crime":
            crime = d.violent_crime
            break;
        case "homicide":
            crime = d.homicide
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
    var pop = d.population
    if (name != "mass_shootings")
        return crime / pop * 1000;
    else
        return crime;
}

function getCrimeMax(name, d) {
    var crime;
    switch (name) {
        case "mass_shootings":
            crime = +d.mass_shootings
            break;
        case "violent_crime":
            crime = +d.violent_crime
            break;
        case "homicide":
            crime = +d.homicide
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
    if (name != "mass_shootings")
        return crime / pop * 1000;
    else
        return crime;
}