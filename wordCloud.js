//------------------------

var wordsDS;

var wordCloud = {
    data: 0,
    svg : 0,
    words: [],
    layout: 0
};


d3.csv("/data/ms/MSWords.csv").then(function (data) {
    wordsDS = data;
    gen_WordCloud();
});

function gen_WordCloud() {
    console.log("gen wordCloud");
    
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
   wordCloud.svg = d3.select("#wordcloud").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    //filter the data to match the time period
    filterData();

    wordCloud.data.forEach(function(d){
        d.values.forEach(function(d2){
            if(d2.Word in wordCloud.words){
                wordCloud.words[d2.Word].count += 1;
            }
            else{
                wordCloud.words.push({word: d2.Word, count: 1})
            }

        })
        
    })

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    wordCloud.layout = d3.layout.cloud()
        .size([width, height])
        .words(wordCloud.words.map(function(d) { return {text: d.word, size:d.count*10}; }))
        .padding(5)        //space between words
        .rotate(function() { return 0; })
        .fontSize(function(d) { return d.size; })      // font size of words
        .on("end", draw);
    wordCloud.layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here

    function draw(words) {
  wordCloud.svg
    .append("g")
      .attr("transform", "translate(" + wordCloud.layout.size()[0] / 2 + "," + wordCloud.layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size; })
        .style("fill", "#69b3a2")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });

    }

}

function update_wordCloud(){
    wordCloud.svg.remove();
    d3.select("svg").remove();
    wordCloud.words = [];
    gen_WordCloud();
}


function filterData() {
    //console.log("states");
    //console.log(states);
    var filteredData = wordsDS.filter(function (d, key) {
    
        if (countStates() == 0) {
            return (d.year >= year_filters[0] && d.year <= year_filters[1]);
        } else {
            return (d.year >= year_filters[0] && d.year <= year_filters[1] && (d.CODE == states[0] || d.CODE == states[1] || d.CODE == states[2]));
        }
    });

    var entries = d3.nest()
        .key(function (d) { return d.CODE; })
        .entries(filteredData);

    wordCloud.data = entries;

}