var stateBeforeSelection = {
    genre: null,
    yearStart: 0,
    yearEnd: 0
}

function newTimeFrame(year) {
    var start = year -5;
    if (start < 1979) start = 1979

    var end = year + 5;
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
        /* var year = document.createAttribute("Year");
        year.value = vgNames[i].Year;
        option.setAttribute("Year",year);
        var genre = document.createAttribute("Genre");
        genre.value = vgNames[i].Genre
        option.setAttribute("Genre",genre); */
        option.appendChild(document.createTextNode(vgNames[i].Year + " - " + vgNames[i].Genre))
        list.appendChild(option);
    }
    console.log("video game dataset is now loaded");  
});

function vgSelected() {
    console.log("this is called");
    var game = document.getElementById("vgSearch").value;
    console.log(game);
    
    //Save state
    stateBeforeSelection.genre = vgSelectedGenre;
    stateBeforeSelection.years = year_filters;

    //updateState
    var gameData = vgNames.filter(function (d) {
        return (d.Name==game)
    })
    console.log(gameData[0]);
    
    vgSelectedGenre = gameData[0].Genre.trim();

    console.log(year_filters);
    newTimeFrame(gameData[0].Year);
    console.log(year_filters);
    
    update_barChart();
    update_lineChart();
    //gen_timeline();
}