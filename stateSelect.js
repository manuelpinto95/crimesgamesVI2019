var states = ["","",""];
/* states[0] = "CA";
states[1] = "LA";
states[2] = "AK"; */

function countStates() {
    var i = 0;
    var count = 0;
    for (i = 0; i < 3; i++) {
        if (states[i] != "")
            count++;
    }
    return count;
}

function findState(name) {
    for (i = 0; i < 3; i++) {
        if (states[i] == name)
            return i;
    }
    return -1;
}

function addState() {
    var newState = document.getElementById("c1").value;
    if (newState=="") return;

    var i = 0;
    for (i = 0; i < 3; i++) {
        if (states[i] == newState) {
            alert("State already selected");
            return;
        }
    }
    
    for (i = 0; i < 3; i++) {
        if (states[i] == "") {
            break;
        }
    }
    // here i takes the value of the first empty slot

    if (i == 3) { //no empty slots
        alert("You can only compare a maximum of 3 states at a time");
        return;
    } else {
        states[i] = newState;
    }
    var ul = document.getElementById("stateList");
    var li = document.createElement("li");
    li.setAttribute("style","color:" + statesColors[i]);
    li.setAttribute("id","id"+i);
    var span = document.createElement("span");
    span.setAttribute("class", "close");
    var text = document.createTextNode(stateDic[newState])
    span.appendChild(document.createTextNode("x"));
    li.appendChild(span);
    li.appendChild(text);
    ul.appendChild(li);

    span.addEventListener("click", function () {
        console.log("close event is called");     
        this.parentElement.remove();
        removeState(newState);
    });

    console.log(states);
    //update_colors()
    update_lineChart();
    update_top3();
}

function update_colors() {
    var i = 0;
    for (i = 0; i < 3; i++) {
        var index = findState(states[i])
        if (index!=-1) {
            var li = document.getElementById("id"+i);
            li.setAttribute("style","color:" + statesColors[i]);
            li.setAttribute("id","id"+i);
        }
    }
}

function removeState(state) {
    console.log("remove is called, state to remove is:" + state);

    var i = 0;
    for (i = 0; i < 3; i++) {
        if (states[i] == state) {
            states[i] = ""
        }
    }

    for (i = 0; i < 2; i++) {
        if (states[i] == "" && states[i + 1] != "") {
            states[i] = states[i + 1];
            states[i + 1] = "";
            var li = document.getElementById("id"+(i+1));
            li.setAttribute("style","color:" + statesColors[i]);
            li.setAttribute("id","id"+i);

        }
    }
    console.log(states);
    //update_colors()
    update_lineChart();
    update_top3();
}