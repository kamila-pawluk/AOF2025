function addNewTask(){
    const input = document.getElementById('taskInput');
    const taskDescriptionValue = input.value.trim();


    if(taskDescriptionValue ===  "") {
    return alert('Please enter a task description');
    }

    const newTask = {id: Date.now(), taskDescription: taskDescriptionValue, done: false};
    tasks.push(newTask);
    saveTasksToLocalStorage();
    renderTask(tasks);
    input.value = '';
}

function removeTask(id){
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToLocalStorage();
    renderTask(tasks);
}

function toogleTaskDone(id){
    tasks = tasks.map(task => {
        if(task.id === id){
            return {...task, done: !task.done};
        }
        return task;
    });
    saveTasksToLocalStorage();
    filterTasks();
    renderTask(tasks);
}

function filterTasks(){
   const filter = document.querySelector('select').value;

   let filteredTasks;
   if(filter === 'all'){
       filteredTasks = tasks;
   } else if (filter === 'done'){
       filteredTasks = tasks.filter(task => task.done);
   } else if (filter === 'not-done'){
       filteredTasks = tasks.filter(task => !task.done);
   }

   renderTask(filteredTasks);
}


function saveTasksToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.removeItem('newTask');
    localStorage.removeItem('newTaskJson');
}