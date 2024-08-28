"use strict";
var displayField = document.getElementById("display");
var error = document.getElementById("errmsg");
function displayvalue(num) {
    displayField.value += num.toString();
}
function clearscreen() {
    displayField.value = '';
}
function calculate() {
    if (displayField.value == "") {
        error.style.display = "block";
    }
    else {
        error.style.display = "none";
        try {
            displayField.value = eval(displayField.value).toFixed(5);
        }
        catch (error) {
            displayField.value = "Error";
        }
    }
}
