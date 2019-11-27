var dataset, full_dataset;
var dispatch;
var selectedBar, selectedCircle;

d3.json("oscar_winners.json").then(function (data) {
    dispatch = d3.dispatch("movieEvent");
    dispatch.on("movieEvent", function (movie) {
        if (selectedBar != null) {
            selectedBar.attr("fill", "purple");
        }
        selectedBar = d3.select("rect[title=\'" + movie.title + "\']");
        selectedBar.attr("fill", "red");
        if (selectedCircle != null) {
            selectedCircle.attr("fill", "purple");
        }
        selectedCircle = d3.select("circle[title=\'" + movie.title + "\']");
        selectedCircle.attr("fill", "red");
    })
    full_dataset = data;
    dataset = full_dataset.slice(0, 35);
    gen_bars();
    gen_scatterplot();

});

function gen_bars() {
    var w = 600;
    var h = 300;

    var svg = d3.select("#the_chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);


    var padding = 30;
    var bar_w = 15;

    var hscale = d3.scaleLinear()
        .domain([10, 0])
        .range([padding, h - padding]);

    var xscale = d3.scaleLinear()
        .domain([0, dataset.length])
        .range([padding, w - padding]);


    var yaxis = d3.axisLeft()
        .scale(hscale);

    var xaxis = d3.axisBottom()
        .scale(d3.scaleLinear()
            .domain([dataset[0].oscar_year, dataset[dataset.length - 1].oscar_year])
            .range([padding + bar_w / 2, w - padding - bar_w / 2]))
        .tickFormat(d3.format("d"))
        .ticks(dataset.length / 4);
    //.ticks(20);

    svg.append("g")
        .attr("transform", "translate(30,0)")
        .attr("class", "y axis")
        .call(yaxis);

    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xaxis);

    svg.selectAll("rect")
        .data(dataset)
        .enter().append("rect")
        .on("mouseover", function (d) {
            dispatch.call("movieEvent", d, d);
        })
        .attr("width", Math.floor((w - padding * 2) / dataset.length) - 1)
        .attr("height", function (d) {
            return h - padding - hscale(d.rating);
        })
        .attr("fill", "purple")
        .attr("x", function (d, i) {
            return xscale(i);
        })
        .attr("y", function (d) {
            return hscale(d.rating);
        })
        .attr("title", function (d) {
            return d.title;
        });
}

function gen_scatterplot() {
    var w = 600;
    var h = 300;

    var svg = d3.select("#the_chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "blue");


    var padding = 30;
    var bar_w = 15;
    var r = 5;

    var hscale = d3.scaleLinear()
        .domain([10, 0])
        .range([padding, h - padding]);

    var xscale = d3.scaleLinear()
        .domain([0.5, d3.max(dataset, function (d) {
            return d.budget;
        }) / 1000000])
        .range([padding, w - padding]);

    var yaxis = d3.axisLeft()
        .scale(hscale);

    var xaxis = d3.axisBottom()
        .scale(xscale)
        .ticks(dataset.length / 2);

    var cscale = d3.scaleLinear()
        .domain([d3.min(dataset, function (d) {
                return d.year;
            }),
            d3.max(dataset, function (d) {
                return d.year;
            })
        ])
        .range(["red", "blue"]);


    gY = svg.append("g")
        .attr("transform", "translate(30,0)")
        .attr("class", "y axis")
        .call(yaxis);


    gX = svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xaxis);

    svg.selectAll("circle")
        .data(dataset)
        .enter().append("circle")
        .on("mouseover", function (d) {
            dispatch.call("movieEvent", d, d);
        })
        .attr("r", r)
        .attr("fill", "purple")
        .attr("cx", function (d, i) {
            if (d.budget_adj == 0) {
                return padding;
            }
            return xscale(d.budget_adj / 1000000);
        })
        .attr("cy", function (d) {
            console.log(d.rating);

            return hscale(d.rating);
        })
        .attr("title", function (d) {
            return d.title;
        });
}