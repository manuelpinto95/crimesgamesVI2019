var dataset;

/* d3.json("oscar_winners_recent.json").then(function (data) {
    dataset = data;
    gen_vis();
    //console.log(dataset);
}); */

var dataset, full_dataset; // new variable
d3.json("oscar_winners.json").then(function (data) {
    full_dataset = data; // this variable is always the full dataset
    dataset = full_dataset.slice(0, 35); // most recente movies
    gen_vis();
});

function gen_vis() {
    var w = 800;
    var h = 400;

    var padding = 30;

    var svg = d3.select("#the_chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var hscale = d3.scaleLinear() // we are setting a linear scale
        .domain([0, 10]) // values range
        .range([h - padding, padding]);
    var xscale = d3.scaleLinear()
        .domain([0, dataset.length])
        .range([padding, w - padding]);

    var yaxis = d3.axisLeft() // we are creating a d3 axis
        .scale(hscale); // fit to our scale

    var bar_w = Math.floor(w / dataset.length) - 1;

    var xaxis = d3.axisBottom() // we are creating a d3 axis
        .scale(d3.scaleLinear()
            .domain([dataset[0].oscar_year, dataset[dataset.length - 1].oscar_year]) // values from movies' years
            .range([padding + bar_w / 2, w - padding - bar_w / 2])) // we are adding our padding
        .tickFormat(d3.format("d")) // format of each year
        .ticks(dataset.length / 4); // number of bars between each tick

    svg.append("g") // we are creating a 'g' element to match our yaxis
        .attr("transform", "translate(30,0)") // 30 is the padding
        .call(yaxis);

    svg.append("g") // we are creating a 'g' element to match our x axis
        .attr("transform", "translate(0," + (h - padding) + ")")
        .attr("class", "xaxis")
        .call(xaxis);

    svg.selectAll("rect")
        .data(dataset)
        .enter().append("rect") // for each item, we are appending a rectangle
        .attr("width", Math.floor(w / dataset.length) - 2) // each bar’s width depends on the total number of bars
        .attr("height", function (d) {
            return h - padding - hscale(d.rating); // fit to our scale
        })
        //.attr("style","fill:rgb(0,0,255);stroke-width:2;stroke:rgb(0,0,0")
        .attr("fill", "PURPLE")
        .attr("x", function (d, i) { // d -> each item | i -> each item's index
            return xscale(i); // we are setting each bar position, fit to our scale
        })
        .attr("y", function (d) {
            return hscale(d.rating); // fit to our scale
        });

    svg.selectAll("rect").append("title") // adding a title for each bar
        .data(dataset)
        .text(function (d) {
            return d.title;
        });


    d3.select("#old") // we are selecting the element with class 'old'
        .on("click", function () { // click event
            dataset = full_dataset.slice(35, 70); // temp dataset now has older movies
            bar_w = 0;
            svg.selectAll("rect") // same code, but now we only change values
                .data(dataset)
                .transition() // add a smooth transition
                .duration(1000)
                .attr("height", function (d) {
                    return h - padding - hscale(d.rating);
                })
                .attr("fill", "red") // color change
                .attr("y", function (d) {
                    return hscale(d.rating);
                })
                .select("title")
                .text(function (d) {
                    return d.title;
                });
            xaxis.scale(d3.scaleLinear()
                .domain([dataset[0].oscar_year, dataset[dataset.length - 1].oscar_year])
                .range([padding + bar_w / 2, w - padding - bar_w / 2]));
            d3.select(".xaxis")
                .call(xaxis);
        })

    d3.select("#new") // we are selecting the element with class ‘new’
        .on("click", function () { // click event
            dataset = full_dataset.slice(0, 35); // temp dataset now has recent movies
            bar_w = 0;
            svg.selectAll("rect") // same code, but now we only change values
                .data(dataset)
                .transition() // add a smooth transition
                .duration(1000)
                .attr("height", function (d) {
                    return h - padding - hscale(d.rating);
                })
                .attr("fill", "purple") // color change
                .attr("y", function (d) {
                    return hscale(d.rating);
                })
                .select("title")
                .text(function (d) {
                    return d.title;
                });
            xaxis.scale(d3.scaleLinear()
                .domain([dataset[0].oscar_year, dataset[dataset.length - 1].oscar_year])
                .range([padding + bar_w / 2, w - padding - bar_w / 2]));
            d3.select(".xaxis")
                .call(xaxis);
        })
}