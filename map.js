var mapData;
var projection;

d3.csv("data/crime/crime_and_ms.csv").then(function (data) {
    mapData = data;
})

function update_map() {
    map.svg.remove();
    gen_map();
}
var map = {
    svg: 0
}

function gen_dots() {
    //console.log("dots start");
    var coordinatesData = msTop3data;

    var filteredData = msTop3data.filter(function (d, key) {
        if (countStates() == 0) {

            return (d.Year >= year_filters[0] && d.Year <= year_filters[1])
        } else {

            return (d.Year >= year_filters[0] && d.Year <= year_filters[1] && (d.state_abbr == states[0] || d.state_abbr == states[1] || d.state_abbr == states[2]))
        }
    })

    /*TOLLTIP DIV*/
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    map.svg.append("circle")
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", (w - 380))
        .attr("cy", (h - 30))
        .attr("r", 7)
        .attr("style", "stroke-width:0.5;stroke:rgb(0,0,0)")
        .attr("fill", d3.schemeSet1[5])

    map.svg.append("text")
        .attr("class", "title")
        .attr("font-size", "15px")
        .attr("transform", "translate(" + (w - 370) + "," + (h - 26) + ")")
        .attr("text-anchor", "start")
        .text("= one mass shooting");

    map.svg.append("text")
        .attr("class", "title")
        .attr("font-size", "15px")
        .attr("transform", "translate(" + (w - 383) + "," + (h - 10) + ")")
        .attr("text-anchor", "center")
        .text("the size of the circle is proportional to the number of victims");

    for (let index = 0; index < filteredData.length; index++) {
        map.svg.append("circle") // Uses the enter().append() method
            .attr("class", "dot2") // Assign a class for styling
            .attr("cx", function () {
                return projection([filteredData[index].Longitude, filteredData[index].Latitude])[0];
            })
            .attr("cy", function () {
                return projection([filteredData[index].Longitude, filteredData[index].Latitude])[1];
            })
            .attr("r", function () {
                return Math.sqrt(filteredData[index].Victims * 2);
            })
            .attr("fill", function(){
                if (filteredData[index].Year!=selectedGameYear)
                    return d3.schemeSet1[5];
                else
                    return d3.schemeCategory10[3];
            })
            .attr("style", "stroke-width:0.5;stroke:rgb(0,0,0)")
            .attr("ID", filteredData[index].ID)
            .attr("Year", function () { return String(filteredData[index].Year).trim(); })
            .on("mousemove", function () {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);

                div.html(filteredData[index].Title + "<br/>" + "Victims: " + filteredData[index].Victims)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY + 10) + "px");

                ms_dispatch.call("msEvent", filteredData[index], filteredData[index]);
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
                ms_dispatch.call("msEvent", 0, 0);
            })
    }
    //console.log("dots done");
}

function gen_states() {
    //console.log("map start");
    data = mapData.filter(function (d, key) {
        return (d.Year >= year_filters[0] && d.Year <= year_filters[1])

    })
    data = d3.nest()
        .key(function (d) { return d.name.trim(); })
        .rollup(function (leaves) {
            return d3.sum(leaves, function (d) {
                return getCrime(selectedCrimeType, d);
            });
        }).entries(data)
        .map(function (d) {
            return { state: d.key, crime: d.value };
        });
    //console.log(data);

    h = (window.innerHeight / 2 - 60);
    w = h * 1.6 + 100;

    document.getElementById("wordcloud").style.width = window.innerWidth - w - 500;

    padding = 40;
    r = 4;

    map.svg = d3.select("#map")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    map.svg.append("text")
        .attr("class", "title")
        .attr("font-size", "20px")
        .attr("transform", "translate(" + (20) + ",25)")
        .attr("text-anchor", "start")
        .text("Crime in the USA form " + year_filters[0] + " to " + year_filters[1]);

    var config = { "color1": "#d3e5ff", "color2": "#08306B", "stateDataColumn": "state", "valueDataColumn": "crime" }

    var COLOR_COUNTS = 10;

    var SCALE = 2;

    var COLOR_FIRST = config.color1, COLOR_LAST = config.color2;

    var rgb = hexToRgb(COLOR_FIRST);

    var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);

    rgb = hexToRgb(COLOR_LAST);
    var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);

    var MAP_STATE = config.stateDataColumn;
    var MAP_VALUE = config.valueDataColumn;

    var valueById = d3.map();

    var startColors = COLOR_START.getColors(),
        endColors = COLOR_END.getColors();

    var colors = [];

    for (var i = 0; i < COLOR_COUNTS; i++) {
        var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
        var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
        var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
        colors.push(new Color(r, g, b));
    }

    var quantize = d3.scaleQuantize()
        .domain([0, 1.0])
        .range(d3.range(COLOR_COUNTS).map(function (i) { return i }));

    projection = d3.geoAlbersUsa().translate([w / 2, h / 2]).scale([780]);
    var path = d3.geoPath().projection(projection);

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    /*TOLLTIP DIV*/
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    d3.csv("data/USA/us-state-names.csv").then(function (names) {

        name_id_map = {};
        id_name_map = {};

        for (var i = 0; i < names.length; i++) {
            name_id_map[names[i].name] = names[i].id;
            id_name_map[names[i].id] = names[i].name;
        }
        //console.log(name_id_map);
        //console.log(id_name_map);

        data.forEach(function (d) {
            var id = name_id_map[d[MAP_STATE]];

            valueById.set(id, +d[MAP_VALUE]);
        });
        //console.log(valueById);

        //console.log(valueById.get(38));

        quantize.domain([d3.min(data, function (d) { return +d[MAP_VALUE] }),
        d3.max(data, function (d) { return +d[MAP_VALUE] })]);

        var min = d3.min(data, function (d) { return +d[MAP_VALUE] });
        var interval = (d3.max(data, function (d) { return +d[MAP_VALUE] }) - d3.min(data, function (d) { return +d[MAP_VALUE] })) / 10;


        /*LEGEND*/
        var legend = map.svg.append("g")
            .attr("class", "key")
            .attr("transform", "translate(" + (w - 310) + ",30)");

        var text = selectedCrimeType == "mass_shootings" ? "Number of mass shootings" : crimeNameDic[selectedCrimeType] + " ocurrences per 1000 capita"
        map.svg.append("text")
            .attr("class", "title")
            .attr("font-size", "15px")
            .attr("transform", "translate(" + (w - 150) + ",25)")
            .attr("text-anchor", "middle")
            .text(text);


        var x = d3.scaleLinear()
            .domain([1, 11])
            .rangeRound([0, 300])

        for (let index = 0; index < colors.length; index++) {
            var c = colors[index].getColors();
            var color = "rgb(" + c.r + "," + c.g + "," + c.b + ")";
            legend.append("rect")
                .attr("y", 0)
                .attr("x", 1 + index * 30)
                .attr("height", 20)
                .attr("width", 30)
                .attr("fill", color)
                .on("mousemove", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html("[" + (min + index * interval).toFixed(0) + " - " + (min + (index + 1) * interval).toFixed(0) + "]")
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY + 10) + "px");
                })
                .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })

        }
        legend.call(d3.axisBottom(x)
            .tickFormat(d3.format("d"))
            .ticks(11)
            .tickValues(""))
        /*.tickFormat(function (x, i) { return i ? x : x + "%"; })
        .tickValues("oi")
        .select(".domain")
        .remove(); */

        /*
        
        
        g.append("text")
            .attr("class", "caption")
            .attr("x", x.range()[0])
            .attr("y", -6)
            .attr("fill", "#000")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Unemployment rate");
        
        g.call(d3.axisBottom(x)
            .tickSize(13)
            .tickFormat(function (x, i) { return i ? x : x + "%"; })
            .tickValues(color.domain()))
            .select(".domain")
            .remove(); */

        d3.json("data/USA/us.json").then(function (us) {

            map.svg.append("g")
                .attr("class", "states-choropleth")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                /* .attr("transform", "scale(" + SCALE + ")") */
                .attr("style", function (d) {
                    var state = id_name_map[d.id];
                    //console.log(state);
                    var code = codeDic[state];
                    //console.log(code);
                    var stateIndex = findState(code);
                    if (stateIndex != -1)
                        return ("stroke-width:6;stroke:" + statesColors[stateIndex]);

                    return "style", "stroke-width:0.5;stroke:rgb(0,0,0)";
                })
                .style("fill", function (d) {
                    if (valueById.get(d.id)) {
                        var i = quantize(valueById.get(d.id));
                        //console.log("OK id:" + d.id);
                        var color = colors[i].getColors();
                        return "rgb(" + color.r + "," + color.g +
                            "," + color.b + ")";
                    } else {
                        var color = colors[0].getColors(); //TODO: check why sattes with zero MS fail
                        return "rgb(" + color.r + "," + color.g +
                            "," + color.b + ")";
                    }
                })
                .attr("d", path)
                .on("mousemove", function (d) {
                    var sel = d3.select(this);
                    //sel.raise() TODO tirar isto maybe
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(id_name_map[d.id] + "<br/>" + (valueById.get(d.id) ? valueById.get(d.id).toFixed(2) : 0)) //TODO: check why sattes with zero MS fail
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY + 10) + "px");
                })
                .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on("click", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);

                    var index = findState(codeDic[id_name_map[d.id]])
                    if (index == -1) {
                        addStatebyName(codeDic[id_name_map[d.id]]);
                    }
                    else {
                        //console.log("removing state: " + "span" + index);
                        var span = document.getElementById("span" + index);
                        span.parentElement.remove();
                        removeState(codeDic[id_name_map[d.id]]);
                    }

                })

            map.svg.append("path")
                .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
                .attr("class", "states")
                .attr("transform", "scale(" + SCALE + ")")
                .attr("d", path);
        });

    });
    //console.log("map done");
    /* callback(); */
}

function gen_map() {

    gen_states()
    setTimeout(function afterTwoSeconds() {
        gen_dots()
    }, 1000)
    setTimeout(function afterTwoSeconds() {
        gen_dots()
    }, 3000)
    setTimeout(function afterTwoSeconds() {
        gen_dots()
    }, 4000)

};

function Interpolate(start, end, steps, count) {
    var s = start,
        e = end,
        final = s + (((e - s) / steps) * count);
    return Math.floor(final);
}

function Color(_r, _g, _b) {
    var r, g, b;
    var setColors = function (_r, _g, _b) {
        r = _r;
        g = _g;
        b = _b;
    };

    setColors(_r, _g, _b);
    this.getColors = function () {
        var colors = {
            r: r,
            g: g,
            b: b
        };
        return colors;
    };
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function valueFormat(d) {
    if (d > 1000000000) {
        return Math.round(d / 1000000000 * 10) / 10 + "B";
    } else if (d > 1000000) {
        return Math.round(d / 1000000 * 10) / 10 + "M";
    } else if (d > 1000) {
        return Math.round(d / 1000 * 10) / 10 + "K";
    } else {
        return d;
    }
}
