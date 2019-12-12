var year_filters = [1979, 2016];
var year_hovered = null;

// utility function
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
};

function gen_timeline() {
    var margin = {
        left: 30,
        right: 30
    },
        height = 45,
        range = [1979, 2016],
        step = 1; // change the step and if null, it'll switch back to a normal slider

    width = window.innerWidth - 10; // Use the window's width 
    var svg = d3.select('#timeline')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var slider = svg.append("g")
        .classed('slider', true)
        .attr('transform', 'translate(' + margin.left + ', ' + (height / 2) + ')');

    /**/

    // using clamp here to avoid slider exceeding the range limits
    var xScale = d3.scaleLinear()
        .domain(range)
        .range([0, width - margin.left - margin.right])
        .clamp(true);

    // array useful for step sliders
    var rangeValues = d3.range(range[0], range[1], step || 1).concat(range[1]);

    var xAxis = d3.axisBottom(xScale).tickValues(rangeValues).tickFormat(function (d) {
        return d;
    });

    xScale.clamp(true);

    // this is the main bar with a stroke (applied through CSS)
    var track = slider.append('line').attr('class', 'track')
        .attr('x1', xScale.range()[0])
        .attr('x2', xScale.range()[1]);

    // this is a bar (steelblue) that's inside the main "track" to make it look like a rect with a border
    var trackInset = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-inset');

    var trackInterval = slider.append('line').attr('class', 'track-interval')
        .attr('x1', xScale.range()[0])
        .attr('x2', xScale.range()[1]);

    var ticks = slider.append('g').attr('class', 'ticks').attr('transform', 'translate(0, 4)')
        .call(xAxis);

    // drag handles
    var minHandle = slider.append('circle').classed('handle', true)
        .attr('r', 12)
        .attr("id", "minHandle")
        .on("mouseover", function (d) {
            d3.select(this).style("cursor", "pointer");
        })
        .on("mouseout", function (d) {
            d3.select(this).style("cursor", "default");
        });

    var maxHandle = slider.append('circle').classed('handle', true)
        .attr('r', 8)
        .attr("id", "maxHandle")
        .on("mouseover", function (d) {
            d3.select(this).style("cursor", "pointer");
        })
        .on("mouseout", function (d) {
            d3.select(this).style("cursor", "default");
        });;

    // optional initial transition
    /** /
    slider.transition().duration(750)
        .tween("drag", function () {
            var i = d3.interpolate(1985, 2005);
            return function (t) {
                dragged(xScale(i(t)));
            }
        });
    /**/

    //min starts at first year
    minHandle.attr('cx', xScale(1979));

    //max starts at latest year
    maxHandle.attr('cx', xScale(2016));

    // drag behavior initialization
    var drag = d3.drag()
        .on('start.interrupt', function () {
            slider.interrupt();
        })
        .on('start', function () {
            selectHandle(d3.event.x);
        })
        .on('drag', function () {
            dragging(d3.event.x);
            //update_linechart();
        })
        .on('end', function () {
            d3.select("#treemap").selectAll("*").remove();
            d3.select("#heatmap").selectAll("*").remove();
            //d3.select("#linechart").selectAll("*").remove();
            update_barChart();
            update_lineChart();
            update_top3();
            update_map();
        });;

    // this is the bar on top of above tracks with stroke = transparent and on which the drag behaviour is actually called
    // try removing above 2 tracks and play around with the CSS for this track overlay, you'll see the difference
    var trackOverlay = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-overlay')
        .call(drag);

    var handleInUse;

    function selectHandle(value) {
        var minPos = minHandle.attr('cx');
        var maxPos = maxHandle.attr('cx');

        var x = xScale.invert(value),
            index = null,
            midPoint, cx, xVal;
        if (step) {
            // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
            for (var i = 0; i < rangeValues.length - 1; i++) {
                if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
                    index = i;
                    break;
                }
            }
            midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
            if (x < midPoint) {
                cx = xScale(rangeValues[index]);
                xVal = rangeValues[index];
            } else {
                cx = xScale(rangeValues[index + 1]);
                xVal = rangeValues[index + 1];
            }
        } else {
            // if step is null or 0, return the drag value as is
            cx = xScale(x);
            xVal = x.toFixed(3);
        }

        if (year_filters[0] == 1979 && year_filters[0] == year_filters[1])
            handleInUse = maxHandle;
        else if (year_filters[1] == 2016 && year_filters[0] == year_filters[1])
            handleInUse = minHandle;
        else
            handleInUse = Math.abs(minPos - cx) < Math.abs(maxPos - cx) ? minHandle : maxHandle;
    }

    function dragging(value) {
        var x = xScale.invert(value),
            index = null,
            midPoint, cx, xVal;
        if (step) {
            // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
            for (var i = 0; i < rangeValues.length - 1; i++) {
                if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
                    index = i;
                    break;
                }
            }
            midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
            if (x < midPoint) {
                cx = xScale(rangeValues[index]);
                xVal = rangeValues[index];
            } else {
                cx = xScale(rangeValues[index + 1]);
                xVal = rangeValues[index + 1];
            }
        } else {
            // if step is null or 0, return the drag value as is
            cx = xScale(x);
            xVal = x.toFixed(0);
        }
        // use xVal as drag value, e.g YEAR
        if (handleInUse == minHandle) {
            cx = clamp(cx, xScale(1979), maxHandle.attr('cx'));
            xVal = clamp(xVal, 1979, year_filters[1]);
            year_filters[0] = xVal;
        } else {
            cx = clamp(cx, minHandle.attr('cx'), xScale(2016));
            xVal = clamp(xVal, year_filters[0], 2016);
            year_filters[1] = xVal;
        }

        handleInUse.attr('cx', cx);

        trackInterval
            .attr('x1', minHandle.attr('cx'))
            .attr('x2', maxHandle.attr('cx'));
    }
}