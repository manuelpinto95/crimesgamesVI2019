//------------------------

var wordsDS;

function update_wordcloud(){
    wordcloud.svg.remove();
    d3.selectAll('#wordcloud svg').remove();
    wordcloud.words = [];
    wordcloud.layout = 0;
    gen_Wordcloud();

}

var wordcloud = {
    svg: 0,
    data: 0,
    words: [],
    layout: 0
};


d3.csv("/data/ms/MSWords.csv").then(function (data) {

    //TODO: esta apenas criado ainda nao e usado em situacao alguma
    var data_aux = [];
    data.forEach(function(d){
        if(!(d.Word in data_aux)){  //Se a palavra nao existir na lista adiciona
            data_aux.push({word: d.Word, from: [{title: d.Title, state: d.CODE, year: d.year}] });
        }
        else{   // se existir acrescenta a informacao de onde ela veio
            data_aux[d.Word].from.push({title: d.Title, state: d.CODE, year: d.year});
        }
    });

    console.log("Word data AUX:");
    console.log(data_aux);

    wordsDS = data;

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

    wordcloud.data.forEach(function(d){
        d.values.forEach(function(d2){
            if(d2.Word in wordcloud.words){
                wordcloud.words[d2.Word].count += 1;
            }
            else{
                wordcloud.words.push({word: d2.Word, count: 1})
            }

        })
        
    });


    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    
    wordcloud.layout = d3.layout.cloud()
        .size([width, height])
        .words(wordcloud.words.map(function(d) { return {text: d.word, size: (Math.log(d.count)+1) * 30}; }))
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


function filterData() {

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

    wordcloud.data = entries;
}