//------------------------

var cloudWords = [{word: "a", size: 20}];
d3.csv("/data/ms/MSWords.csv").then(function (data) {

    data.forEach(function (d) {
        cloudWords.push({word: d.Word, size: 20});
        /*
        if(d.count < 10 )
            cloudWords.push({word: d.Word, size: 10});
        else
            if(d.cont < 20)
                cloudWords.push({word: d.Word, size: 20});
            else
                if(d.cont < 30)
                    cloudWords.push({word: d.Word, size: 30});
                else
                    cloudWords.push({word: d.Word, size: 40});*/
                    
        //console.log(d.Word);
    });

    //TODO: uncomment
    //gen_WordCloud();
});

function gen_WordCloud() {
    console.log("cloud");
    
    // List of words
    var myWords = cloudWords; //[{word: "Running", size: "10"}, {word: "Surfing", size: "20"}, {word: "Climbing", size: "50"}, {word: "Kiting", size: "30"}, {word: "Sailing", size: "20"}, {word: "Snowboarding", size: "60"} ]

    // set the dimensions and margins of the graph
    var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        height = (window.innerHeight / 2 - 60);
        var mapW = height * 1.6;
        width = window.innerWidth - mapW - 500 - margin.right - margin.left;

    // append the svg object to the body of the page
    var svg = d3.select("#wordcloud").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function (d) {
            return {
                text: d.word,
                size: d.size
            };
        }))
        .padding(5) //space between words
        .rotate(function () {
            return ~~(Math.random() * 2) * 90;
        })
        .fontSize(function (d) {
            return d.size;
        }) // font size of words
        .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
        svg
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) {
                return d.size;
            })
            .style("fill", "steelblue")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) {
                return d.text;
            });
    }
}


