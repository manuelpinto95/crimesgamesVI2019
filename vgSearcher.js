var stateBeforeSelection = {
    genre: null,
    yearStart: 0,
    yearEnd: 0
}

var selectedGameYear = null;
var selectedGameGenre = null;

function newTimeFrame(year) {
    var start = year_filters[0];
    if (year<year_filters[0]) start = year - 5
    if (start < 1979) start = 1979

    var end = year_filters[1]
    if (year>year_filters[1]) end = year + 5
    if (end > 2016) end = 2016;

    year_filters[0] = start;
    year_filters[1] = end;
}

d3.csv("/data/vg/vgNames.csv").then(function (data) {
    data.forEach(function (d) {
        d.Year = +d.Year;
    });
    vgNames = data;
    var list = document.getElementById("vgList");
    for(var i=0;i<vgNames.length;i++) {
        var option = document.createElement("option");
        option.setAttribute("value",vgNames[i].Name);
        option.appendChild(document.createTextNode(vgNames[i].Year + " - " + vgNames[i].Genre ))
        list.appendChild(option);
    }
    console.log("video game dataset is now loaded");
    gen_map();
});

function vgSelected() {
    if (selectedGameYear!=null) {
        alert("Can only visualize 1 game at a time");
        return;
    }
    var game = document.getElementById("vgSearch").value;
    console.log(game);
    
    //Save state
    stateBeforeSelection.genre = vgSelectedGenre;
    stateBeforeSelection.yearStart = year_filters[0];
    stateBeforeSelection.yearEnd = year_filters[1];

    //updateState
    var gameData = vgNames.filter(function (d) {
        return (d.Name==game)
    })
    
    selectedGameGenre = gameData[0].Genre.trim();
    barchart.selectedGameName = game;
    selectedGameYear = gameData[0].Year;

    var ul = document.getElementById("selectedGame");
    var li = document.createElement("li");
    /* li.setAttribute("style","font-color:" + "red");
    li.setAttribute("style","font-weight:bold"); */
    li.setAttribute("class","game_button");
    li.setAttribute("padding", 50);
    var span = document.createElement("span");
    span.setAttribute("class", "close");
    span.appendChild(document.createTextNode("x"));
    li.appendChild(span);
    li.appendChild(document.createTextNode(barchart.selectedGameName + " - " + selectedGameYear));
    ul.appendChild(li);

    span.addEventListener("click", function () {
        console.log("close event is called");     
        this.parentElement.style.display = 'none';
        selectedGameYear = null;
        selectedGameGenre = stateBeforeSelection.genre;
        year_filters[0] = 1979;
        year_filters[1] = 2016;
        console.log(year_filters);
        update_timeline();
        update_barChart();
        update_lineChart();
        update_top3();
    });

    console.log(year_filters);
    newTimeFrame(gameData[0].Year);
    console.log(year_filters);
    
    update_barChart();
    update_lineChart();
    update_timeline();
    update_top3();
}