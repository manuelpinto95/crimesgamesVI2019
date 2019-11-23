function treemap(){

  var width = 800,
      height = 600;

  var treemap = d3.treemap()
      .size([width, height])
      .padding(1);

  var format = d3.format(",d");

  var stratify = d3.stratify()
      .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

  var color = d3.scaleOrdinal()
    .range(d3.schemeCategory10
      .map(function(c){
        c = d3.rgb(c);
        c.opacity = 0.7;
        return c;
      })  
    )
  
      d3.csv("flare.csv").then(function(data) {
    var root = stratify(data)
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    treemap(root);

  d3.select("body")
    .selectAll(".node")
    .data(root.leaves())
    .enter().append("div")
      .attr("class", "node")
      .attr("title", function(d){
        return d.id + "\n" + format(d.value);
      })
      .style("left", function(d){
        return d.x0 + "px";
      })
      .style("top", function(d){
        return d.y0 + "px";
      })
      .style("width", function(d){
        return d.x1 - d.x0 + "px";
      })
      .style("height", function(d){
        return d.y1 - d.y0 + "px";
      })
      .style("background", function(d){
        while (d.depth > 1){
          d = d.parent;
          return color(d.id);
        }
      })
      .text(function(d,i){
        return i;
      })
  });


  function type(d) {
    d.value = +d.value;
    return d;
  }
}

function pack(){
    var width = 800,
      height = 600;

  var svg = d3.select("svg"),
      width = width
      height = height

  var format = d3.format(",d");


  var stratify = d3.stratify()
      .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

  var pack = d3.pack()
      .size([width - 2, height - 2])
      .padding(3);

  var color = d3.scaleSequential(d3.interpolateMagma)
    .domain([-4,4]);

  d3.csv("flare.csv").then(function(data) {

    var root = stratify(data)
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.value - a.value; });

    pack(root);

    var node = svg.select("g")
    .selectAll("g")
    .data(root.descendants())
    .enter().append("g")
      .attr("transform", function(d){
        return "translate(" + d.x + "," + d.y + ")";
      })
      .attr("class", function(d){
        return "node" + (!d.children ? " node--leaf" : d.depth ? "" : "node--root");
      })
      .each(function(d){
        d.node = this;
      });
  
    node.append("circle")
        .attr("id", function(d){
          return "node-" + d.id;
        })
        .attr("r",function(d){
          return d.r;
        })
        .style("fill", function(d){
          return color(d.depth);
        });
    
    var leaf = node.filter(function(d){
      return !d.children;
    });

    leaf.append("text")
      .text(function(d,i){
        return i;
      });
            
  });
 
}
