class Student {
    constructor(name, grade) {
        this.name = name;
        this.grade = grade;
    }
}

class GradeManager {
    constructor() {
        this.students = [];
        this.error = document.getElementsByClassName("errmsg")[0];
        this.outputgrade = document.getElementById("gradesOutput");
        this.avgop = document.getElementById("averageOutput");
    }

    addStudent(name, grade) {
        if (this.isValidGrade(grade)) {
            const student = new Student(name, parseInt(grade));
            this.students.push(student);
            this.error.style.display = "none";
            console.log(name, grade, this.students);
        } else {
            this.error.style.display = "block";
        }
    }

    isValidGrade(grade) {
        return parseInt(grade) >= 1 && parseInt(grade) <= 100;
    }

    displayGrades() {
        this.outputgrade.innerHTML = "";
        this.students.forEach((student) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${student.name} - ${student.grade}`;
            this.outputgrade.appendChild(listItem);
        });
    }

    calculateAverage() {
        if (this.students.length > 0) {
            const sum = this.students.reduce((total, student) => total + student.grade, 0);
            const avg = sum / this.students.length;
            this.avgop.textContent = `Average Grade: ${avg.toFixed(2)}`;
        } else {
            this.avgop.textContent = "No students to calculate the average.";
        }
    }
}

const studentNameInput = document.getElementById("studentName");
const gradeInput = document.getElementById("grade");
const btnAddStudent = document.getElementById("addStudent");
const btnDisplayGrades = document.getElementById("displayGrades");
const btnCalculateAverage = document.getElementById("calculateAverage");

const gradeManager = new GradeManager();

function addstuds(event){
    if(studentNameInput.value=="" && gradeInput.value=="" )
    {
        document.getElementById("nullval").style.display="block";
    }
    else{
        document.getElementById("nullval").style.display="none";
        gradeManager.addStudent(studentNameInput.value, gradeInput.value);
    }
    

}

function displaystuds(event){
    gradeManager.displayGrades();
}



function calculate(event){
    gradeManager.calculateAverage();
}

