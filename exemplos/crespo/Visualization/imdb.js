//python3 -m http.server 8888
var dataset_movies;
var dataset_years;
var axis = {}
var nodes;
var linksData;
var imgFolder = "/img/"
var scatterCircleList


var dispatch = d3.dispatch("movieClicked")
var current_movies
var xKey, yKey 
var max_movies
var svg_clev, svg_scat, svgLineChart
//---------------------------------------------------------------------------------------

function activateScatterTippy() {
	const template = document.querySelector('#myTemplate')
	scatterCircleList = document.querySelectorAll('#scatterPlot>svg>circle')
	for (var i = 0; i < scatterCircleList.length; i++) {
		var title = scatterCircleList[i].getElementsByTagName("titulo")[0].innerHTML
		var clonedTemplate = template.cloneNode(true);
		clonedTemplate.setAttribute("style", "display: inline-block");
		clonedTemplate.setAttribute("index", i)
		clonedTemplate.getElementsByClassName('moviePoster')[0].setAttribute("src", imgFolder + title.replace(":", "")+".jpg")
		clonedTemplate.getElementsByClassName('movieTitle')[0].innerHTML = title
		const tip = tippy(scatterCircleList[i], {
		  	html:clonedTemplate,
		  	onShow(){
		  		const content = this.querySelector('#myTemplate')
		  		i = content.getAttribute("index")
				content.getElementsByClassName('movieX')[0].innerHTML = scatterCircleList[i].getAttribute("xKey") +": "+scatterCircleList[i].getAttribute("x")
				content.getElementsByClassName('movieY')[0].innerHTML = scatterCircleList[i].getAttribute("yKey") +": "+scatterCircleList[i].getAttribute("y")
			},
		  	arrow: true,
		  	arrowType: 'wide',
		  	animation: 'shift-toward',
		  	distance: 15,
		  	arrowTransform: 'scale(2)',
			placement: 'top',
		  	duration: [550, 300],
		  	hideOnClick: false,
		  	inertia:true
		})
	}
}


function activateTimelineTippy() {
	const template = document.querySelector('#timeLineTippyTemplate')
	timelineCircleList = document.querySelectorAll('#timeline>svg>circle')
	for (var i = 0; i < timelineCircleList.length; i++) {
		var titles = timelineCircleList[i].getElementsByTagName("titulo")[0].innerHTML.split(";")
		var clonedTemplate = template.cloneNode(true);
		clonedTemplate.setAttribute("style", "display: inline-block");
		for (var t = 0; t < titles.length; t++) {
			//console.log(titles[t])
			var titulo = titles[t]
			var clonedPoster = clonedTemplate.getElementsByClassName('moviePoster')[0].cloneNode(true)
			clonedPoster.setAttribute("src", imgFolder + titulo.replace(":", "")+".jpg")
			clonedPoster.setAttribute("style", "display: inline-block");
			clonedTemplate.appendChild(clonedPoster)
		}
		
		const tip = tippy(timelineCircleList[i], {
		  	html:clonedTemplate,
		  	arrow: true,
		  	arrowType: 'wide',
		  	animation: 'shift-toward',
		  	distance: 15,
		  	arrowTransform: 'scale(2)',
			placement: 'top',
		  	duration: [550, 300],
		  	hideOnClick: false,
		  	inertia:true
		})
	}
}


function activateClevelandTippy() {
	const tip = tippy("[title]", {
	  	arrow: true,
	  	animation: 'perspective',
	  	distance: 10,
	  	arrowTransform: 'scaleX(0.5)',
		placement: 'top',
	  	duration: [350, 300],
	  	hideOnClick: false,
	  	inertia:true,
	  	dynamicTitle: true
	})
}



function activateAxisTippy() {
	const tip = tippy("#clevelandDot>svg>g.y>.tick", {
	  	arrow: true,
	  	animation: 'perspective',
	  	distance: 10,
	  	arrowTransform: 'scaleX(0.5)',
		placement: 'top',
	  	duration: [350, 300],
	  	hideOnClick: false,
	  	inertia:true,
	  	dynamicTitle: true
	})
}

function activateCircleTippy() {
	const template = document.querySelector('#actorCircleTippyTemplate')
	actorCircleLinkList = document.querySelectorAll('#actor_Circle>svg>g>g>path');
	for (var i = 0; i < actorCircleLinkList.length; i++) {
		var titles = actorCircleLinkList[i].getElementsByTagName("title")[0].innerHTML.split(";")
		var clonedTemplate = template.cloneNode(true);
		clonedTemplate.setAttribute("style", "display: inline-block");
		clonedTemplate.getElementsByClassName('movieTitle')[0].innerHTML = titles.join(" | ")
		for (var t = 0; t < titles.length; t++) {
			//console.log(titles[t])
			var titulo = titles[t]
			var clonedPoster = clonedTemplate.getElementsByClassName('moviePoster')[0].cloneNode(true)
			clonedPoster.setAttribute("src", imgFolder + titulo.replace(":", "")+".jpg")
			clonedPoster.setAttribute("style", "display: inline-block");
			clonedTemplate.insertBefore(clonedPoster,clonedTemplate.firstChild)
		}
		const tip = tippy(actorCircleLinkList[i], {
			html:clonedTemplate,
			  arrow: true,
			  animation: 'perspective',
			  distance: 10,
			  arrowTransform: 'scaleX(0.5)',
			placement: 'top',
			followCursor: true,
			  duration: [350, 300],
			  hideOnClick: false,
			  inertia:true
		})
	}
	
}



function shortTitle(s) {
	return s.length > 20 ? s.substr(0,20) + "..." : s;
}

function initiateAxes(){
	/*axis["Budget (millions)"] = {"min": 0.1, "log": true, "ticks": [0.1,0.2,0.4,0.8, 1.6, 3.2, 6.4, 12.8, 25.6, 51.2, 102.4, 204.8] }
	axis["Gross (millions)"] = {"min": 0.1, "log": true, "ticks": [0.1,0.2,0.4,0.8, 1.6, 3.2, 6.4, 12.8, 25.6, 51.2, 102.4, 204.8, 409.6, 819.2, 1638, 3166 ] }
	axis["Awards"] = {"min": 0, "log": false, "ticks": [1,2,4,8, 16, 32, 64, 128, 256] }
	axis["Nominations"] = {"min": 0, "log": false, "ticks": [1,2,4,8, 16, 32, 64, 128, 256, 512] }
	axis["Rating"] = {"min": 8, "log": false}
	console.log(axis)*/

	axis["Budget (millions)"] = {"min": 0.1, "log": true, "ticks": [0.1,0.2,0.4,0.8, 1.6, 3.2, 6.4, 12.8, 25.6, 51.2, 102.4, 204.8],
					 "attribute": function(d){return d.metadata.budget_inflated}}

	axis["Gross (millions)"] = {"min": 0.1, "log": true, "ticks": [0.1,0.2,0.4,0.8, 1.6, 3.2, 6.4, 12.8, 25.6, 51.2, 102.4, 204.8, 409.6, 819.2, 1638, 3166 ],
							"attribute": function(d){return d.metadata.worldWide_Gross_Inflated}}
	
	axis["Awards"] = {"min": 0, "log": false, "ticks": [1,2,4,8, 16, 32, 64, 128, 256],
					"attribute": function(d){return d.awards.totalAwards}}

	axis["Nominations"] = {"min": 0, "log": false, "ticks": [1,2,4,8, 16, 32, 64, 128, 256, 512],
						"attribute": function(d){return d.awards.nominations}}

	axis["Rating"] = {"min": 8, "log": false, 
					 "attribute": function(d){return d.rating}}

}

dataFolder = "./Datas/"


d3.json(dataFolder + "MoviesFiltered.json", function (data_movies) {
	d3.json(dataFolder + "movieDecades.json", function (data_decades) {
		d3.json(dataFolder + "filmsPerYear.json", function (data_years) {
			dataset_movies = data_movies.movies;
			dataset_years = data_years.years;
			dataset_decades = data_decades.decades;

			fillMovieList()
			activateButtons()
			initiateAxes()
			scatterPlot()
			timeline();
			timelineLineChart();
			createClevelandDotPlot();
			
			
		})	
	})
})


	
function fillMovieList(){
	var movs = dataset_movies.sort(function(a, b){
	    if(a.title < b.title) return -1;
	    if(a.title > b.title) return 1;
	    return 0;
	})
	for (var i = 0; i < movs.length; i++) {
		var opt = document.createElement("option")
		$(opt).attr("value", movs[i].title)
		document.getElementById("movieList").appendChild(opt)
	}
}


function activateButtons(){
	$(".btn-clev-x").click(function(){
		$(".btn-clev-x").removeClass("active");
		$(this).addClass("active");
	});

	$(".btn-scat-y").click(function(){
		$(".btn-scat-y").removeClass("active");
		$(this).addClass("active");
	});
}

/*------------------------------------------ ScatterPlot -------------------------------------------------------*/
function updateScatterPlot(svg, xKey, yKey){
	padding_w = svg.attr("padding_w")
	padding_h = svg.attr("padding_h")
	w = svg.attr("width")
	h = svg.attr("height")
	padding_right=10

	xAttr = axis[xKey]["attribute"]
	yAttr = axis[yKey]["attribute"]

	if(axis[xKey]["log"]){
		var xscale = d3.scaleLog().base(2).domain([axis[xKey]["min"],Math.ceil(d3.max(dataset_movies, xAttr)/10)*10]).range([padding_w, w-padding_right])
		var xaxis = d3.axisBottom().scale(xscale).tickFormat(d3.format(".4")).tickValues(axis[xKey]["ticks"]);
	}
	else{
		var xscale = d3.scaleLinear().domain([axis[xKey]["min"],Math.ceil(d3.max(dataset_movies, xAttr)/10)*10]).range([padding_w, w-padding_right])
		var xaxis = d3.axisBottom().scale(xscale).tickFormat(d3.format(".10")).ticks(15);
	}
	
	if(axis[yKey]["log"]){
		var yscale = d3.scaleLog().base(2).domain([axis[yKey]["min"],Math.ceil(d3.max(dataset_movies, yAttr)/10)*10]).range([h-padding_h, padding_h ])
		var yaxis = d3.axisLeft().scale(yscale).tickFormat(d3.format(".4")).tickValues(axis[yKey]["ticks"]);
	}
	else{
		var yscale = d3.scaleLinear().domain([axis[yKey]["min"],Math.ceil(d3.max(dataset_movies, yAttr)/10)*10]).range([h-padding_h, padding_h ])
		var yaxis = d3.axisLeft().scale(yscale).tickFormat(d3.format(".10")).ticks(15);
	}
	
	// Update circles
    svg.selectAll("circle")
        .data(dataset_movies) 
        .attr("x", function(d) {
            return xAttr(d);  // Circle's X
        })
        .attr("y", function(d) {
            return yAttr(d);  // Circle's X
        })
        .attr("xKey", xKey)
        .attr("yKey", yKey)
		.transition() 
        .duration(1000)        
        .attr("cy", function(d) {
            return yscale(yAttr(d));  // Circle's Y
        })  // duracao da animacao
        .on("start", function repeat () {  // inicio da animacao
        	circle = d3.select(this)
            circle.attr("fill", "green")
        })
        .attr("cx", function(d) {
            return xscale(xAttr(d));  // Circle's X
        })
        .attr("cy", function(d) {
            return yscale(yAttr(d));  // Circle's Y
        })
        .on("end", function repeat() {  // fim da animacao
            d3.select(this) 
                .transition()
                .duration(200) // faz uma especie de fade
                .attr("fill", "rgba(0, 128, 128, 0.75 )")
        });
        
	svg.select(".x.axis").transition().duration(1000).call(xaxis); // Update X Axis
	svg.select(".y.axis").transition().duration(1000).call(yaxis); // Update X Axis


	svg.select(".x.axisLabel").text(xKey);
	svg.select(".y.axisLabel").text(yKey);


}

function scatterPlot(){
	var w = 805;
	var h = 410;
	var padding_w = 130;
	var padding_h = 40
	padding_right=20
	xKey = "Awards", yKey="Budget (millions)"

	
	xAttribute = axis[xKey]["attribute"]
	yAttribute = axis[yKey]["attribute"]
	//se ficar lento, tentar mudar o d3.max(cenas) para uma variavel para ele n tar sempre a calcular
	//escala logaritmica no x fica feio so para avisar
	var xscale = d3.scaleLinear().domain([axis[xKey]["min"],Math.ceil(d3.max(dataset_movies, xAttribute)/10)*10]).range([padding_w, w-padding_right])
	var yscale = d3.scaleLog().base(2).domain([axis[yKey]["min"],Math.ceil(d3.max(dataset_movies, yAttribute)/10)*10]).range([h-padding_h, padding_h ])

	var yaxis = d3.axisLeft().scale(yscale).tickFormat(d3.format(".4")).tickValues(axis[yKey]["ticks"]);
	var xaxis = d3.axisBottom().scale(xscale).tickFormat(d3.format("d")).ticks(15);


	var svg = d3.select("#scatterPlot").append("svg").attr("width",w).attr("height",h).attr("padding_w", padding_w).attr("padding_h", padding_h);
	svg_scat = svg

	svg.append("g").attr("transform", "translate(0,"+(h-padding_h)+")").attr("class","x axis").call(xaxis)
	svg.append("g").attr("transform", "translate("+padding_w+",0)").attr("class","y axis").call(yaxis)

	svg.append("text").attr("class", "x axisLabel").attr("text-anchor", "end").attr("x", w-padding_right).attr("y", h-5).text(xKey);
	svg.append("text").attr("class", "y axisLabel").attr("text-anchor", "end").attr("x", -padding_h-6).attr("y", 65).attr("dy", ".75em").attr("transform", "rotate(-90)").text(yKey);


	var radius = 5
	svg.selectAll("circle").data(dataset_movies).enter().append("circle")
												.attr("r", radius)
												.attr("fill", "rgba(0, 128, 128, 0.75 )")
												.attr("x", function(d) {
										            return xAttribute(d);  // Circle's X
										        })
										        .attr("y", function(d) {
										            return yAttribute(d);  // Circle's X
										        })
										        .attr("xKey", xKey)
										        .attr("yKey", yKey)
												.attr("cx", function(d,i){
													return xscale(xAttribute(d))
												}).
												attr("cy", function(d){
													return yscale(yAttribute(d));
												})
												.append("titulo").text(function(d){return d.title;});
	d3.selectAll(".btn-scat-y")	
		.on("click",function(){
				yKey = this.getAttribute("key")
				updateScatterPlot(svg,xKey, yKey)
		});


	//Connection Scatter -> Cleveland
	$('#scatterPlot>svg>circle').on("click",function(d){
				dispatch.call("movieClicked",d.currentTarget,d.currentTarget) //d.currentTarget = html do circle
		});

	$('#scatterPlot>svg>circle').on("mouseover", function(){
		var titulo = this.getElementsByTagName("titulo")[0].innerHTML
		toggleHighlight(titulo, true)
	})
	.on("mouseout",function(){
		var titulo = this.getElementsByTagName("titulo")[0].innerHTML
		toggleHighlight(titulo, false)
	});

	activateScatterTippy()

}


//----------------------------------------------------------------------------------------------------------

//-------------------------------- Cleveland Dot Plot ------------------------------------------------------

function updateSlider(min, max, attribute, value){
	var slider = d3.select("#clevelandSlider")
	slider.property("min", min);
	slider.property("max", max);
	slider.property("value", value);
	slider.property("step", attribute == "Rating" ? 0.1 : 1 ) //(max - min)/10 < 1 ? 0.1 : 1
	d3.select("#max-attribute").text(attribute);
	d3.select("#max-value").text(value);
}

function updateClevelandValues(svg, data, xscale, yscale, xAttr, reset){
	//svg.selectAll("svg>line").remove()

	if ($("#clevelandDot>svg>line").length == 0){
		svg.selectAll("Lines").data(data).enter().append("line") 
		svg.selectAll("circle").data(data).enter().append("circle").append("titulo")
		
	}
	svg.selectAll("line").classed("transition", true)
	svg.selectAll("line").data(data).attr("stroke", "rgba(128,128,128,0.7)")
											.attr("x1", svg.attr("padding_w"))
											.attr("x2", function(d) { return svg.attr("width")-10; })
											.attr("y1", function(d) { return yscale(shortTitle(d.title)); })
											.attr("y2", function(d) { return yscale(shortTitle(d.title));} )
											.classed("transition", false);
	//Dots
	//svg.selectAll("line.transition")
	svg.selectAll("line.transition").attr("stroke", "rgba(0,0,0,0)")
	svg.selectAll("circle").classed("transition", true)
	svg.selectAll("circle").data(data).attr("r", 7).classed("transition", false)
											  .attr("title", function(d){ return xAttr(d)})
											  .attr("cy", function(d){ return yscale(shortTitle(d.title)) })
											  .attr("cx",  function(d){ return reset ? svg.attr("width")-10 : $(this).attr("cx")})
											  .transition().duration(500)
											  .attr("cx", function(d,i){ return xscale(xAttr(d)) })
											  .select("titulo").text(function(d){ return d.title }); //quando faz hover aparece titulo
    svg.selectAll("circle.transition").attr("r", 0)
}



function updateClevelandDotPlot(svg, dataset, xName, xmax, reset = true){
	var xAttr = axis[xName]["attribute"]
	//console.log(xAttr)
	dataset_filtered = dataset.filter(function(d){ return xAttr(d) <= xmax})
	//console.log(xmax)
	//console.log(dataset_filtered)
	data = dataset_filtered.sort(function(x,y){
		return d3.descending(xAttr(x), xAttr(y))
	}).slice(0,Math.min(10, dataset.length))

	var padding_w = svg.attr("padding_w"), padding_h = svg.attr("padding_h"), h = svg.attr("height"), w = svg.attr("width")
	var padding_right = 15

	var min = d3.min(dataset, xAttr)
	var minDomain = Math.floor(min/10)*10
	if(xName == "Rating") minDomain = Math.floor(min)
	var maxDomain = Math.ceil(d3.max(dataset, xAttr)/10)*10

	var xscale = d3.scaleLinear().domain([xName=="Rating" ? axis["Rating"]["min"] : 0, maxDomain]).range([padding_w, w - padding_right])
	var yscale = d3.scaleBand().domain(data.map(function(d){return shortTitle(d.title);})).rangeRound([0, h-padding_h]).padding(padding_h)

	/*nticks = 10
	diffDomain = maxDomain - minDomain
	if (diffDomain < 9) nticks = diffDomain*/

	var xaxis = d3.axisBottom().scale(xscale).tickFormat(d3.format(".10")).ticks(10);
	var yaxis = d3.axisLeft().scale(yscale);

	updateClevelandValues(svg, data, xscale, yscale, xAttr, reset)

	if (svg.select(".x.axis").empty()){
	    svg.append("g").attr("transform", "translate(0,"+(h-padding_h)+")").attr("class","x axis").call(xaxis)
		svg.append("g").attr("transform", "translate("+padding_w+",0)").attr("class","y axis").call(yaxis)
		svg.append("text").attr("class", "x axisLabel").attr("text-anchor", "end").attr("x", w - padding_right).attr("y", h -padding_h-6).text(xName);

	}
	else{
    	svg.select(".x.axis").transition().duration(1000).call(xaxis); // Update X Axis
    	svg.select(".y.axis").transition().duration(500).call(yaxis); // Update Y Axis
    	svg.select(".x.axisLabel").text(xName)

	}
	svg.selectAll('.y.axis>.tick') // gs for all ticks
  		.attr('title', function(d){ 
  			for (var i = 0; i < data.length; i++) {
  				if (shortTitle(data[i].title) == d){
  					return data[i].title
  				}
  			}
  		}) // append title with text

    
	d3.selectAll("#clevelandDot>svg>circle").on("click", function(){
		var titulo = this.getElementsByTagName("titulo")[0].innerHTML
		toggleHighlight(titulo, false)
		var circles = $("#scatterPlot>svg>circle").filter(function(){return titulo == this.getElementsByTagName("titulo")[0].innerHTML})
		circles.each(function(){$(this).click()})
		$(".tippy-popper")[0].click()
		
	});

					
	d3.selectAll("#clevelandDot>svg>circle").on("mouseover", function(){
		var titulo = this.getElementsByTagName("titulo")[0].innerHTML
		toggleHighlight(titulo, true)
	})
	.on("mouseout",function(){
		var titulo = this.getElementsByTagName("titulo")[0].innerHTML
		toggleHighlight(titulo, false)
	});

 	activateAxisTippy()
    updateSlider(xName=="Rating" ? min : Math.ceil(min), xscale.domain()[1], xName, xmax) 
    
}

function createClevelandDotPlot(){
	var w = 835, h = 325, padding_h = 30, padding_w = 165;

	var svg = d3.select("#clevelandDot").append("svg").attr("width",w).attr("height",h).attr("padding_w", padding_w).attr("padding_h", padding_h);
	
	svg_clev = svg
	current_movies = dataset_movies

	max_movies = function () {return Math.ceil(d3.max(current_movies, axis[xKey]["attribute"])/10)*10}

	d3.selectAll("#movies")	
		.on("click",function(){
			current_movies = dataset_movies	
			$("#movies").addClass("active")
			$("#clevelandDot>svg>circle").removeClass("selected")
			clearOtherVis()
			updateClevelandDotPlot(svg,current_movies,xKey, max_movies())
		})

	//X Buttons
	d3.selectAll(".btn-clev-x")	
		.on("click",function(){
			xKey = this.getAttribute("key")
			updateScatterPlot(svg_scat, xKey, yKey)
			updateLineChart(svgLineChart, xKey)
			updateClevelandDotPlot(svg,current_movies, xKey, max_movies(), false)
		})

	xKey = "Awards"
	updateClevelandDotPlot(svg,current_movies, xKey, max_movies())
	

	//Slider
	d3.select("#clevelandSlider").on("input", function() {
		updateClevelandDotPlot(svg,current_movies, xKey, +this.value, false)
	});
	activateClevelandTippy()

}

function clearOtherVis(){
	d3.selectAll("#scatterPlot>svg>circle.selected").classed("selected", function (d,i) {return false})
	node = d3.select("#actor_circle").selectAll(".node--selected");
	node.classed("node--selected", function (d,i) {return false});
	node.each(function(n) { n.count = 0});
	d3.selectAll(".link--selected").classed("link--selected", function (d,i) {return false})
	d3.selectAll(".year_selected").classed("year_selected", function (d,i) {return false})
}


//----------------------------------------------------------------------------------------------------------

//-------------------------------- ACTOR CIRCLE ------------------------------------------------------------
d3.json(dataFolder +"links.json",function(data_links){
		linksData = (data_links.links)//.slice(0,data_links.links.length/3);
		//console.log(linksData.filter(function(n){return n.nrMovies>=10}))
		createActorsCircle(linksData)
	})

function createActorsCircle(links){
	var circleDiameter = 920,circleRadius = circleDiameter / 2,innerCircleRadius = circleRadius - 120;
	var cluster = d3.cluster().size([360,innerCircleRadius]);
	var line = d3.radialLine()
		.curve(d3.curveBundle.beta(0.55))
		.radius(function(d) { return d.y; })
		.angle(function(d) { return d.x / 180 * Math.PI; });
	var valueline = d3.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; });


	var svg = d3.select("#actor_circle").append("svg")
				.attr("width", circleDiameter)
				.attr("height", circleDiameter)
				.attr("id","actorSVG")
				.append("g")
				.attr("transform", "translate(" + circleRadius + "," + circleRadius + ")");
	
	var link = svg.append("g").selectAll(".link"),
		node = svg.append("g").selectAll(".node");
	

	var root = d3.hierarchy(packageHierarchy(links),(d)=>d.children);
	
	cluster(root)

	var nodes = root.descendants();
	link =link
		.data(getLinksTree(root.leaves()))
		.enter().append("path")
			.attr("class", "link")
			.attr('d',d=>line(d.source.path(d.target)))
			.on("mouseover",mouseoveredLink)
			.on("mouseout",mouseouted)
			.append('title').text(function(d){ return d.movies.join(";") });
	activateCircleTippy()

	node = node
		.data(nodes)
		.enter().append("text")
			.attr("class", "node")
			.attr("dy", "0.31em")
			.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
			.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
			.text(function(d) { return d.data.sourceName; })
			.on("mouseover",mouseovered)
			.on("mouseout",mouseouted)
	
	node.each(function(n){ n.count=0;})

	function mouseovered(d) {
		link = d3.select("#actor_circle").selectAll(".link--highlighted")
		node = d3.select("#actor_circle").selectAll(".node--highlighted")
		node
			.each(function(n) { n.target = n.source = false; });
		link
			.classed("link--active", function(l) {
				if (l.source === d) {l.source.source = true;return l.target.target = true;} })
			.filter(function(l) {return l.target === d || l.source === d })
			.each(function() {this.parentNode.appendChild(this); });

		node
			.classed("node--target", function(n) { return n.target; })
			.classed("node--source", function(n) { return n.source; });
	}

	function mouseoveredLink(linkline) {
		link = d3.select("#actor_circle").selectAll(".link--highlighted")
		node = d3.select("#actor_circle").selectAll(".node--highlighted")

		linksource=linkline.source
		linktarget=linkline.target
		node
			.each(function(n) { n.target = n.source = false; });
		link
			.classed("link--active", function(l) {if (l.source === linksource && l.target===linktarget) { l.source.source = true;return l.target.target = true;} })
			.filter(function(l) {return l.target === linksource || l.source === linksource; })
			.each(function() {this.parentNode.appendChild(this); });
		node
			.classed("node--target", function(n) { return n.target||n.source; })
	}
	function mouseouted(d) {
		link = d3.select("#actor_circle").selectAll(".link--highlighted")
		node = d3.select("#actor_circle").selectAll(".node--highlighted")
		
		link.classed("link--active", false);

		node.classed("node--target", false)
			.classed("node--source", false);
	}
	
	d3.select("#circleSlider").on("input", function() {
		var y=this.value
		d3.select("#minFilmsValue").text(y);
		updateActorsCircle(y)
	});

	updateActorsCircle(2)
	d3.select("#circleSlider").property("value", 2);
	d3.select("#minFilmsValue").text(2);
}

function updateActorsCircle(minFilms){
	node = d3.selectAll(".node")
	link = d3.selectAll(".link")
	node.classed("node--highlighted",false)
	link.classed("link--highlighted",false)
	if(minFilms>1){
		node=node.filter(function(d){return d.data.nrMovies>=minFilms})
		link.filter(function(l){return (l.source.data.nrMovies>=minFilms && l.target.data.nrMovies>=minFilms)})
			.classed("link--highlighted",true)
			.each(function() {this.parentNode.appendChild(this); });
		node.classed("node--highlighted",true)
	}
	else{
		node.classed("node--highlighted",true)
		link.classed("link--highlighted",true)
	}
}

function packageHierarchy(actors) {
	var map = {"":{'name':"",'children':[]}};
	
	actors.forEach(function(d) {
		map[''].children.push(d)
	});
	
	return map[""];
}


function getLinksTree(links){
	var map = {},
		targets  = [];
	links.forEach(function(d){
		map[d.data.sourceName]=d;
	});
	//console.log(links)
	links.forEach(function(d){
		
		d.data.targets.forEach(function(i){
			if (map[i.targetName]!=undefined)
				targets.push({source: map[d.data.sourceName], target: map[i.targetName],movies: i.movies})
		});
	});
	return targets
}
/*--------------------------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------- TimeLine -----------------------------------------------------*/

function timeline(){
	var w = 1900, h = 100, padding_h = 40, padding_w = 20;

	var svg = d3.select("#timeline").append("svg").attr("width",w).attr("height",h);

	var minDomain = Math.floor(d3.min(dataset_years, function(d){return d.year})/10)*10
	var maxDomain = Math.ceil(d3.max(dataset_years, function(d){return d.year})/10)*10
	var xscale = d3.scaleLinear().domain([minDomain,maxDomain]).range([padding_w, w-padding_w])
	var xaxis = d3.axisBottom().scale(xscale).tickSizeInner([20]).tickFormat(d3.format("d")).ticks(10);

	svg.append("g").attr("transform", "translate(0,"+(h-padding_h)+")").attr("class","x axis").call(xaxis)

	svg.selectAll("circle").data(dataset_years).enter().append("circle")
											  .attr("r", function (d) { return 5 + d.movies.length})
											  .attr("cx", function(d,i){ return xscale(d.year) })
											  .attr("cy", function(d){ return h-padding_h})
											  .attr("fill", "rgba(50,50,50,0.9)")
											  .append("titulo").text(function(d){ return d.movies.join(";") }); //quando faz hover aparecem titulos dos filmes

	d3.selectAll("#timeline>svg>circle")	
		.on("click",function(){
			var prevCirc = $(document.querySelectorAll(".year_selected")[0])
			//console.log("Hello")
			//console.log(prevCirc[0])
			//console.log("bye")
			var thisTitles =  this.getElementsByTagName("titulo")[0].innerHTML.split(";")
			console.log(prevCirc.length)
			if (prevCirc.length > 0){

				var titulos = prevCirc[0].getElementsByTagName("titulo")[0].innerHTML.split(";")
				var circles = $("#scatterPlot>svg>circle").filter(function(){return titulos.includes(this.getElementsByTagName("titulo")[0].innerHTML)})
				circles.each(function(){$(this).click()})

				if (titulos[0]==thisTitles[0]){return}
				
			}
			var circles = $("#scatterPlot>svg>circle").filter(function(){return thisTitles.includes(this.getElementsByTagName("titulo")[0].innerHTML)})
			circles.each(function(){$(this).click()})

		
		});

	d3.selectAll("#timeline>svg>circle")	
		.on("mouseover",function(){
			var thisTitles =  this.getElementsByTagName("titulo")[0].innerHTML.split(";")
			for (var i = 0; i < thisTitles.length; i++) {
				toggleHighlight(thisTitles[i], true)
			}
		})
		.on("mouseout", function(){
			var thisTitles =  this.getElementsByTagName("titulo")[0].innerHTML.split(";")
			for (var i = 0; i < thisTitles.length; i++) {
				toggleHighlight(thisTitles[i], false)
			}
		})
	
}

function timelineLineChart(){
	var w = 1900, h = 100, padding_h = 20, padding_w = 20;

	svgLineChart = d3.select("#lineChart").append("svg").attr("width", w).attr("height", h).attr("padding_w", padding_w).attr("padding_h", padding_h)
  	updateLineChart(svgLineChart, "Awards");
  	activateTimelineTippy()
  	
}


function updateLineChart(svg, yKey){
	var w = svg.attr("width"), h = svg.attr("height"), padding_h = svg.attr("padding_h"), padding_w = svg.attr("padding_w");
	var decdata = []
	dataset_decades.forEach(function(d){
		decdata.push([+d.decade+9.999, +d[yKey]])
		decdata.push([+d.decade, +d[yKey]])

	})
	
	decdata.sort(function(a,b){return a[0]-b[0];});

	// if(axis[yKey]["log"])
	// 	var y = d3.scaleLog().base(2).domain([axis[yKey]["min"],Math.ceil(d3.max(dataset_decades, function(d){return d[yKey]}))]).range([h-padding_h, padding_h ])
	// else
		var y = d3.scaleLinear().domain([axis[yKey]["min"],Math.ceil(d3.max(dataset_decades, function(d){return d[yKey]}))]).range([h-padding_h, padding_h ])
	

	var minDomain = Math.floor(1920)
	var maxDomain = Math.ceil(2020)

	var x = d3.scaleLinear().domain([minDomain, maxDomain]).range([padding_w, w-padding_w]);
	//var y = d3.scaleLinear().domain([0, 2700]).range([h-padding_h, padding_h]);
	var valueline = d3.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });
	
	
    if(svg.select("path").empty())
    	svg.append("path").attr("class", "line").attr("d", valueline(decdata)).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-linejoin", "round").attr("stroke-linecap", "round").attr("stroke-width", 2.5)
  	else
  		svg.transition().select(".line").duration(750).attr("d", valueline(decdata))
}

//----------------------------------------------------------------------------------------------------------------

//----------------------------------------- Connections ----------------------------------------------------------
function findMovie(title, dataset){
	for(i=0; i < dataset.length; i++){
		if (dataset[i].title == title){
			return dataset[i]
		}
	}
	return null;
}

function addToCleveland(movie){
	current_movies = current_movies.length < dataset_movies.length ? current_movies : []
	if (findMovie(movie.title, current_movies) == null) { current_movies.push(movie)} 
}

function setHighlightOnCircle(movie, value){
	var links = d3.select("#actor_circle").selectAll(".link").filter(function(l) { return l.movies.includes(movie.title)}),
	nodes = d3.select("#actor_circle").selectAll(".node").filter(function(n) {return (movie.cast.map(function(n){return n.name})).includes(n.data.sourceName)});

	links.classed("link--movie-mouseover", value)
		.each(function() {this.parentNode.appendChild(this); });

	nodes.classed("node--movie-mouseover", value)
}

function setHighlightOnScatter(titulo, value){
	var circles = d3.select("#scatterPlot").selectAll("circle").filter(function(c){return titulo == c.title})
	circles.classed("scatt-mouseover", value)
	//circles.each(function(){$("#scatterPlot>svg").append(this)})	
}

function setHighlightOnCleveland(titulo, value){
	var circles = d3.select("#clevelandDot>svg").selectAll("circle")
	if(value) {circles = circles.filter(function(c){return titulo == c.title})}
	
	circles.classed("mouseover", value)
}

function setHighlightOnTimeline(year,value){
	year = d3.select("#timeline").selectAll("circle").filter(function(y){return y.year == year})
	year.classed("year-mouseover", value)
}


function selectOnCircle(movie){
	var link = d3.select("#actor_circle").selectAll(".link").filter(function(l) { return l.movies.includes(movie.title)}),
	node = d3.select("#actor_circle").selectAll(".node").filter(function(n) {return !((movie.cast.map(function(n){return n.name})).indexOf(n.data.sourceName)<0)});

	
	//console.log(link)
	link
		.classed("link--selected", function(l) { return true; })
		.each(function() {this.parentNode.appendChild(this); });

	node
		.classed("node--selected", function(n) {n.count+=1;return n.count!=0; })
}


function deselectOnCircle(movie){
	
	var link = d3.select("#actor_circle").selectAll(".link").filter(function(l) {return l.movies.indexOf(movie.title)>=0});
	node = d3.select("#actor_circle").selectAll(".node").filter(function(n) {return !((movie.cast.map(function(n){return n.name})).indexOf(n.data.sourceName)<0)});
	//console.log(node)
	//console.log(link)
	link
		.classed("link--selected", false)
		.each(function() {this.parentNode.appendChild(this); });
	node
		.classed("node--selected",function(n){ if(n.count>0){ n.count-=1;}return n.count})
}


function selectOnTimeline(year){
	year = d3.select("#timeline").selectAll("circle").filter(function(y){return y.year == year})
	year = year._groups[0][0] //filter devolve um objeto q tem um atributo _groups q é uma lista com 2 listas em q a primeira tem os circulos
	year.setAttribute("class", "year_selected")
}

function deselectOnTimeline(year){
	allYearScatter = d3.selectAll("#scatterPlot>svg>circle.selected").filter(function(y){return y.year == year})
	if(allYearScatter._groups[0].length != 0)
		return

	circle = d3.select("#timeline").selectAll("circle").filter(function(y){return y.year == year})
	circle = circle._groups[0][0]
	$(circle).removeClass("year_selected")
}


function toggleHighlight(movieTitle, onOff){
	var mov = findMovie(movieTitle,dataset_movies)
	setHighlightOnCircle(mov,onOff)
	setHighlightOnScatter(movieTitle,onOff)
	setHighlightOnTimeline(mov.year, onOff)
	setHighlightOnCleveland(movieTitle, onOff)
}

//Scatter -> Other Vis
dispatch.on("movieClicked.circle", function (circle){
	$('#scatterPlot>svg>circle')
	title = circle.childNodes[0].innerHTML // title e filho do circle
	mov = findMovie(title, dataset_movies)
	$("#movies").removeClass("active")
	if ( !$(circle).hasClass("selected")){
		circle.setAttribute("class", "selected")

		addToCleveland(mov)
		selectOnCircle(mov)
		selectOnTimeline(mov.year)
	}
	else{
		//TODO: notificar
		$(circle).removeClass("selected")
		var x = current_movies.indexOf(mov)
		current_movies.splice(x,1)
		deselectOnCircle(mov)
		deselectOnTimeline(mov.year)
		
	}
	if (current_movies.length == 0){
		current_movies = dataset_movies
		$("#clevelandDot>svg>circle").removeClass("selected")
	}
	else
		$("#clevelandDot>svg>circle").addClass("selected")

	updateClevelandDotPlot(svg_clev,current_movies, xKey, max_movies())

	
})


function selectMovieOnVis(title){
	clearOtherVis()
	current_movies = []
	var circle = d3.select("#scatterPlot").selectAll("circle").filter(function(c){return title == c.title})
	circle = circle._groups[0][0]
	$(circle).click()
}

$(document).ready(function(){
	$("#submitBtn").click(function(){
   	   $("#formMovie").submit();
	});

	$("#formMovie").on("submit", function(e) {
		e.preventDefault();
		title = document.getElementById("inputMovie").value
		selectMovieOnVis(title);
		return false;
	});
});
