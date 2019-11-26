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

d3.csv("/data/crime/crimesoriginal.csv").then(function (data) {
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

function genLineChart() {

    lineChart.w = 1500;
    lineChart.h = 300;

    lineChart.svg = d3.select("#linechart")
        .append("svg")
        .attr("width", lineChart.w)
        .attr("height", lineChart.h);

    lineChart.svg.append("text")
        .attr("class", "title")
        .attr("transform", "translate(700,40)")
        .text(crimeNameDic[selectedCrimeType] + " in " + getStatesText() + " per 1000 capita");

    //console.log(crimeDS);

    filterCrimeData()

    
    console.log(lineChart.data);
    
    lineChart.padding = 40;
    lineChart.bar_w = 20;
    lineChart.r = 3;
    
    defineLineChartAxis()

    lineChart.svg.append("g")
        .attr("transform", "translate(40,0)")
        .attr("class", "y axis")
        .call(lineChart.yAxis);

    lineChart.svg.append("g")
        .attr("transform", "translate(-10," + (lineChart.h - lineChart.padding) + ")")
        .call(lineChart.xAxis);


    lineChart.svg.selectAll("circle")
        .data(lineChart.data)
        .enter().append("circle")
        .attr("r", lineChart.r)
        .attr("fill", function (d) {
            return d3.schemeCategory10[0];
        })
        .attr("year", function (d) {
            return d.Year;
        })
        .attr("cx", function (d, i) {
            return lineChart.xScale(i); //TODO maybe d.Year
        })
        .attr("cy", function (d) {
            var crime = getCrime(selectedCrimeType, d);
            var crimePerCapita = crime / d.population * 1000;
            return lineChart.yScale(crimePerCapita);
        })
        .on("mouseover", function (d) {
            //tooltip.style("display", null);
            dispatch.call("vgEvent", d, d);
        })
}

function update_lineChart() {
    filterCrimeData()
    defineLineChartAxis()
    lineChart.svg.selectAll("circle")
        .data(lineChart.data)
        .transition() // add a smooth transition
        .duration(1000)
        .attr("r", lineChart.r)
        .attr("fill", function (d) {
            return d3.schemeCategory10[0];
        })
        .attr("year", function (d) {
            return d.Year;
        })
        .attr("cx", function (d, i) {
            return lineChart.xScale(i); //TODO maybe d.Year
        })
        .attr("cy", function (d) {
            var crime = getCrime(selectedCrimeType, d);
            var crimePerCapita = crime / d.population * 1000;
            return lineChart.yScale(crimePerCapita);
        });
}

function defineLineChartAxis() {
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
        .ticks(8)
        .tickFormat(function (d) {
            if ((d / 1000) >= 1) {
                d = d / 1000 + "K";
            }
            return d;
        });

    lineChart.xAxis = d3.axisBottom()
        .scale(d3.scaleLinear()
            .domain([lineChart.data[0].Year, lineChart.data[lineChart.data.length - 1].Year])
            .range([lineChart.padding + lineChart.bar_w / 2, lineChart.w - lineChart.padding - lineChart.bar_w / 2]))
        .tickFormat(d3.format("d"))
        .ticks(lineChart.data.length);
}

function crimeSelector() {
    selectedCrimeType = document.getElementById("crimeSelector").value;
    console.log(selectedCrimeType);
    update_lineChart();
}

function getStatesText() {
    if (states == ["", "", ""])
        return "the USA"
    else {
        var ret = "";
        for (var i = 0; i < 3; i++) {
            if (states[i] != "") {
                ret += states[i];
                states += ", "
            }
        }
        return ret;
    }
}

function filterCrimeData() {
    lineChart.data = crimeDS.filter(function (d, key) {
        if (countStates() == 0) {
            return (d.Year >= year_filters[0] && d.Year <= year_filters[1] && d.state_abbr == "the USA")
        } else {
            return (d.Year >= year_filters[0] && d.Year <= year_filters[1] && (d.state_abbr == states[0] || d.state_abbr == states[1] || d.state_abbr == states[2]))
        }
    })
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