let studarray = [];
const studentname = document.getElementById("studentName");
const grade = document.getElementById("grade");
let outputgrade = document.getElementById("gradesOutput");
let btnstud = document.getElementById("addStudent");
let btndisplay = document.getElementById("displayGrades");
let btnavggrade = document.getElementById("calculateAverage");
let error = document.getElementsByClassName("errmsg")[0];
let avgop = document.getElementById("averageOutput");

btnstud.addEventListener("click", () => {
    if (parseInt(grade.value) >= 1 && parseInt(grade.value) <= 100) {
        studarray.push({
            studentname: studentname.value,
            grade: parseInt(grade.value) 
        });
        console.log(studentname.value, grade.value, studarray);
        error.style.display = "none";
    } else {
        error.style.display = "block";
    }
});

btndisplay.addEventListener("click", () => {
    outputgrade.innerHTML = ""; 
    studarray.forEach(students => {
        let list = document.createElement("li");
        list.textContent = `${students.studentname} - ${students.grade}`;
        outputgrade.appendChild(list);
    });
});

btnavggrade.addEventListener("click", () => {
    if (studarray.length > 0) {
        let sum = 0; 
        studarray.forEach(marks => {
            sum += marks.grade;
        });
        let avg = sum / studarray.length;
        console.log(avg); 
        avgop.textContent = `Average Grade: ${avg.toFixed(2)}`; 
    } else {
        avgop.textContent = "No students to calculate the average.";
    }
});
