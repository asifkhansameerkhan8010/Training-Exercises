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

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.classList.add('edit-input');
    editInput.value = taskText;
    editInput.style.display = 'none'; 
    taskContent.appendChild(checkbox);
    taskContent.appendChild(label);
    taskContent.appendChild(editInput);

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit');
    editBtn.textContent = 'Edit';

    const saveBtn = document.createElement('button');
    saveBtn.classList.add('save');
    saveBtn.textContent = 'Save';
    saveBtn.style.display = 'none'; 

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete');
    deleteBtn.textContent = 'Delete';

    taskDiv.appendChild(taskContent);
    taskDiv.appendChild(editBtn);
    taskDiv.appendChild(saveBtn);
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

    editBtn.addEventListener('click', () => {
        label.style.display = 'none';
        editInput.style.display = 'inline-block';
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
        editInput.focus();
    });

    saveBtn.addEventListener('click', () => {
        const newText = editInput.value.trim();
        if (newText !== '') {
            label.textContent = newText;
            label.style.display = 'inline-block';
            editInput.style.display = 'none';
            editBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
        }
    });
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveBtn.click();
        }
    });
}
function addingTask(event)
{
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        createTask(taskText);
        taskInput.value = '';
    } else {
        document.getElementById("error").style.display="block";
    }
}

