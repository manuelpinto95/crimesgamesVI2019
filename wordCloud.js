//------------------------

var wordsDS = [];
var aux = [];

function update_wordcloud(){
    wordcloud.svg.remove();
    d3.selectAll('#wordcloud svg').remove();
    wordcloud.data = 0;
    wordcloud.layout = 0;
    gen_Wordcloud();
}

function wordObjFromDS(otherword){
    return wordsDS.filter(obj => { return String(obj.word).valueOf() === String(otherword).valueOf()})[0];
}

function getYears(obj){
    var res = [];

    obj.from.forEach(function(d){
            res.push(d.year);
    });
    return res;
}

function getStates(obj){
    var res = [];
    obj.from.forEach(function(d){
            res.push(d.state);
    });
    return res;
}

var wordcloud = {
    svg: 0,
    data: 0,
    layout: 0
};


d3.csv("/data/ms/MSWords.csv").then(function (data) {

    data.forEach(function(d){
        
        if(aux.filter(obj => { return String(obj.word).valueOf() === String(d.Word).valueOf()}).length === 0){   
           aux.push({word: d.Word, from: [{title: d.Title, state: d.CODE, year: d.year}] });
        }
        else{
            aux.filter(obj => { return String(obj.word).valueOf() === 
                String(d.Word).valueOf()})[0].from.push({title: d.Title, state: d.CODE, year: d.year});
        }
    });

    wordsDS = aux;
    gen_Wordcloud();
});

function gen_Wordcloud() {
    console.log("gen wordcloud");
    
    // set the dimensions and margins of the graph
    var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        };
    var height = (window.innerHeight / 2 - 60);
    var mapW = height * 1.6;
    var width = window.innerWidth - mapW - 500 - margin.right - margin.left;

    // append the svg object to the body of the page
   wordcloud.svg = d3.select("#wordcloud").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    //filter the data to match the time period
    filterData();

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    
    wordcloud.layout = d3.layout.cloud()
        .size([width, height])
        .words(wordcloud.data.map(function(d) { return {text: d.word, size: (Math.log(d.from.length) * 25)}; }))
        .padding(5)        //space between words
        .rotate(function() { return 0; })
        .fontSize(function(d) { return d.size; })      // font size of words
        .on("end", draw);
    wordcloud.layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here

    function draw(words) {
  wordcloud.svg
    .append("g")
      .attr("transform", "translate(" + wordcloud.layout.size()[0] / 2 + "," + wordcloud.layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .attr("id","cloudWords")
        .style("font-size", function(d) { return d.size; })
        .style("fill", d3.schemeCategory10[0])
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .attr("Years", function(d){
            return getYears(wordObjFromDS(d.text));
        })
        .text(function(d) { return d.text; })
        .on("mouseover", function (d) {
            d3.select(this).style("fill", d3.schemeCategory10[1]);
            barchartTooltipDiv.transition()
                    .duration(200)
                    .style("opacity", .9);

            var text = "ocurrences:<br/>" + wordObjFromDS(d.text).from.length;

                barchartTooltipDiv.html(text)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY + 10) + "px");
                dispatch.call("yearEvent", d, d);

        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", d3.schemeCategory10[0]);
            barchartTooltipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);
            dispatch.call("yearEvent", 0, 0);
        });
        
    }

}



function filterData() {

    var filteredData = wordsDS.filter(function (d, key) {
    
        var years = getYears(d);
        var states = getStates(d);

        if (countStates() == 0) {
            return years.some(elem => elem >= year_filters[0] && elem <= year_filters[1]);
        } 

        else {
            return      years.some(elem => elem >= year_filters[0] && elem <= year_filters[1]) && 
                        states.some(elem => elem == states[0] || elem == states[1] || elem == states[2]);
        }
    });

    var entries = filteredData; /*d3.nest()
        .key(function (d) {
            return d.CODE; })
        .entries(filteredData);*/
        
    wordcloud.data = entries;
}