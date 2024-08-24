const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

function createTask(taskText) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    const taskContent = document.createElement('div');
    taskContent.style.flex = "1";
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const label = document.createElement('label');
    label.textContent = taskText;
    taskContent.appendChild(checkbox);
    taskContent.appendChild(label);
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete');
    deleteBtn.textContent = 'Delete';
    taskDiv.appendChild(taskContent);
    taskDiv.appendChild(deleteBtn);
    taskList.appendChild(taskDiv);
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            label.style.textDecoration = 'line-through';
        } else {
            label.style.textDecoration = 'none';
        }
    });
    deleteBtn.addEventListener('click', () => {
        taskList.removeChild(taskDiv);
    });
}
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        createTask(taskText);
        taskInput.value = ''; 
    } else {
        alert('Please enter a task.');
    }
});
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTaskBtn.click();
    }
});
