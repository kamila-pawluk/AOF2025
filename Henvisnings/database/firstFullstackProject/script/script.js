function getAuthHeader(){
    const token = localStorage.getItem('token');
    return {
        'Authorization' : `Bearer ${token}`, 
        'Content-Type' : 'application/json'
    };
}

document.addEventListener('DOMContentLoaded', () => {
console.log('Page loaded, attempting to load tasks...');
toogleDarkMode();
loadTasks();

    document.getElementById('todo-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted');

            const task = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            deadline: document.getElementById('deadline').value || null
            };
        console.log('Task to be added:', task);
        console.log(getAuthHeader(), ' ', task )
    
        try{
            const response = await fetch('http://localhost:5000/tasks', {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify(task)
            });
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Server response:', result);

            document.getElementById('todo-form').reset();
            loadTasks();
        }   catch(error){
            console.error('Error adding task:', error);
            if (error.status === 401){
                window.location.href = 'index.html';
                return;
            }
            alert('Failed to add task, Please try again!');
        }
});
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
})

//Dark mode functionality
function toogleDarkMode(){
    const themeToggle = document.getElementById('theme-toogle');
    const themeIcon = themeToggle.querySelector('i');

    if(localStorage.getItem('darkMode') === 'true'){
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if(document.body.classList.contains("dark-mode")){
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'true');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'false');
        }
    });
}


async function loadTasks() {
    console.log(getAuthHeader());
    try{
        console.log('Fetching tasks from server...')
        const response = await fetch('http://localhost:5000/tasks');
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tasks = await response.json();
        console.log('Received tasks: ', tasks);

        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';

        if(tasks.length === 0){
            todoList.innerHTML = `<div class="todo-item">No takss yet. Add one above!</div>`;
            return;
        }
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            todoList.appendChild(taskElement);
        });
    } catch (error){
        if (error.status === 401){
            window.location.href = 'index.html';
        }
        console.error('Error loading tasks: ', error);
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '<div class="error-message">Unable to load tasks. Please make sure the server is running</div>';
    }
}

function createTaskElement(task){
    const div = document.createElement('div');
    div.className = `todo-item ${task.completed ? 'completed' : ''}`;

    div.innerHTML = /*HTML*/ `
        <div class="todo-content">
            <div class="todo-title">${task.title}</div>
            <div class="todo-description">${task.description}</div>
            ${task.deadline ? `<div class="todo-deadline">Deadline: ${new Date(task.deadline).toLocaleDateString()}</div>` : ''}
        </div>
        <div class="todo-actions">
            <button onclick="toogleComplete(${task.id}, ${task.completed})">
                <i class="fas fa-check"></i>
            </button>
            <button onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    return div;
}

async function toogleComplete(id, completed){
    try{
        const response = await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify({completed})
        });
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        loadTasks();
    } catch (error){
        console.error('Error updating task:', error);
        if(error.status === 401){
            window.location.href = 'index.html';
            return;
        }
        alert('Failed to update task. Please try again!');
    }
}

async function deleteTask(id){
    if(!confirm('Are you sure you want to delete this task?')){
        try{
            const response = await fetch(`http://localhost:5000/tasks/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            loadTasks();
        } catch (error){
            console.error('Error deleting task:', error);
            if(error.status === 401){
                window.location.href = 'index.html';
                return;
            }
            alert('Failed to delete task. Please try again!');
        }
    }
}