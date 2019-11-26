var states = ["", "", ""];

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
    var span = document.createElement("span");
    span.setAttribute("class", "close");
    span.appendChild(document.createTextNode("x"));
    li.appendChild(span);
    li.appendChild(document.createTextNode(newState));
    ul.appendChild(li);

    span.addEventListener("click", function () {
        console.log("close event is called");     
        this.parentElement.style.display = 'none';
        removeState(newState);
    });

    console.log(states);
    update_lineChart();
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
        }
    }
    console.log(states);
    update_lineChart();
}