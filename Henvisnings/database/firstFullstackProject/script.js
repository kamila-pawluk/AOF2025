document.addEventListener('DOMContentLoaded', () => {
console.log('Page loaded, attempting to load tasks...');
loadTask();

    document.getElementById('todo-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted');

            const task = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            deadline: document.getElementById('deadline').value || null
            };
        console.log('Task to be added:', task);
    
        try{
            const response = await fetch('http://localhost:5000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task)
            });
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Server response:', result);

            document.getElementById('todo-form').reset();
            loadTask();
        }   catch(error){
            console.error('Error adding task:', error);
            alert('Failed to add task, Please try again!');
        }
});
});

async function loadTask() {
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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                completed: !completed
            })
        });
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        loadTask();
    } catch (error){
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again!');
    }
}

async function deleteTask(id){
    if(!confirm('Are you sure you want to delete this task?')){
        try{
            const response = await fetch(`http://localhost:5000/tasks/${id}`, {
                method: 'DELETE'
            });
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            loadTask();
        } catch (error){
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again!');
        }
    }
}