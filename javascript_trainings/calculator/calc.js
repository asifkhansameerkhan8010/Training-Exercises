let button = document.getElementsByTagName("button")[0];
let pa = document.getElementById("p-amount");
let interest = document.getElementById("interest");
let years = document.getElementById("years");
let error = document.getElementsByClassName("err-msg")[0];
let numError1 = document.getElementById("err1");
let numError2 = document.getElementById("err2");
let numError3 = document.getElementById("err3");
let disp1 = document.getElementById("int");
let disp2 = document.getElementById("ta");
let disp3 = document.getElementById("ainfo");


pa.addEventListener('change', () => {
    const val = parseInt(pa.value);
    if (Number.isInteger(val)) {
        if (val > 500 && val <= 10000) {
            console.log("Valid input");
            error.style.display = "none";
            numError1.style.display = "none";
        } else {
            error.style.display = "block";
            numError1.style.display = "none";
        }
    } else {
        error.style.display = "none";
        numError1.style.display = "block";
    }
});


interest.addEventListener('change', () => {
    const intst = parseInt(interest.value);
    if (Number.isInteger(intst)) {
        numError2.style.display = "none";
    } else {
        numError2.style.display = "block";
    }
});


years.addEventListener('change', () => {
    const noofyears = parseInt(years.value);
    if (Number.isInteger(noofyears)) {
        numError3.style.display = "none";
    } else {
        numError3.style.display = "block";
    }
});

button.addEventListener("click", () => {
    const val = parseInt(pa.value);
    const noofyears = parseInt(years.value);

    if (Number.isInteger(val) && val > 500 && val <= 10000 && Number.isInteger(noofyears)) {
        let rate = 0;

        if (val <=1000) {
            rate = 5;
        } else if (val > 1000 && val <= 5000) {
            rate = 7;
        } else if (val > 5000) {
            rate = 10;
        }

        if (noofyears > 5) {
            rate += 2;
        }

        let interest_amount = (val * noofyears * rate) / 100;
        let tamount = interest_amount + val;
        let addinfo = `${rate}%`;

        disp1.innerHTML = ` $${interest_amount.toFixed(2)}`;
        disp2.innerHTML = `$${tamount.toFixed(2)}`;
        disp3.innerHTML = addinfo;
    } else {
        alert("Please enter valid values in the fields.");
    }
});
