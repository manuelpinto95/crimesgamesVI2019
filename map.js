d3.csv("/data/crime/crimesoriginal.csv").then(function (data) {
    console.log("hey");
    
    gen_map()
});

var map = {
    data: 0,
    svg: 0,
    margin: {
        top: 1,
        right: 5,
        bottom: 5,
        left: 5
    },
    w: 0,
    h: 0,
    padding: 40,
    r: 3,
    bar_w: 20
};
function gen_map() {
    console.log("map");

    map.h = (window.innerHeight / 2 - 60);
    map.w = map.h * 1.6;
    
    document.getElementById("wordcloud").style.width = window.innerWidth - map.w - 500;

    map.padding = 40;
    map.r = 4;

    /* var unemployment = d3.map();
    var stateNames = d3.map(); */

    map.svg = d3.select("#map")
        .append("svg")
        .attr("width", map.w)
        .attr("height", map.h);

    /* var path = d3.geoPath();

    var x = d3.scaleLinear()
        .domain([1, 10])
        .rangeRound([600, 860]);

    var color = d3.scaleThreshold()
        .domain(d3.range(0, 10))
        .range(d3.schemeReds[9]);
    

    var g = map.svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(0,40)");

    g.selectAll("rect")
        .data(color.range().map(function (d) {
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
        }))
        .enter().append("rect")
        .attr("height", 8)
        .attr("x", function (d) { return x(d[0]); })
        .attr("width", function (d) { return x(d[1]) - x(d[0]); })
        .attr("fill", function (d) { return color(d[0]); });

    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Crime");

    g.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(function (x, i) { return i ? x : x + "%"; })
        .tickValues(color.domain()))
        .select(".domain")
        .remove();

    var promises = [
        d3.json("states.json"),
        d3.tsv("us-state-names.tsv", function (d) {
            stateNames.set(d.id, d.name)
        }),
        d3.tsv("map.tsv", function (d) {
            console.log("d in map", d);
            unemployment.set(d.name, +d.value);
        })
    ]
    console.log("before promises")
    Promise.all(promises).then(ready)

    function ready([us]) {
        console.log("in ready", topojson.feature(us, us.objects.states).features)
        console.log("statenames", stateNames)
        console.log("employment", unemployment)
        svg.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr("fill", function (d) {
                console.log("d", d)
                console.log("unemployment", unemployment)
                var sn = stateNames.get(d.id)
                console.log("sn", sn)
                d.rate = unemployment.get(stateNames.get(d.id)) || 0
                console.log("rate", d.rate)
                var col = color(d.rate);
                console.log("col", col)
                if (col) {
                    console.log("found col", col, "for d", d)
                    return col
                } else {
                    return '#ffffff'
                }
            })
            .attr("d", path)
            .append("title")
            .text(function (d) {
                console.log("title", d)
                return d.rate + "%";
            });

        svg.append("path")
            .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
            .attr("class", "states")
            .attr("d", path);
    } */
}