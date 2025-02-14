function createNewTask(){
    const newTask = {
        eventName: document.getElementById('eventInput').value,
        startDate: document.getElementById('startDateInput').value,
        endDate: document.getElementById('deadlineInput').value,
        contributor:  document.getElementById('contributorName').value,
        done: false, 
    }
    fetch ('https://67af311fdffcd88a6785de64.mockapi.io/api/v1/tasks', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(newTask)
    }).then(res => {
        if(!res.ok){
            return res.json().then(err => {throw new Error(JSON.stringify(newTask))});
        }
        res.json();
    }).then(task => {
        console.log('Task added:', task);
    }).catch(error =>{
        console.log('Error adding task: ', error); 
    })
}

function getAllTasks(){
    fetch('https://67af311fdffcd88a6785de64.mockapi.io/api/v1/tasks', {
        method: 'GET', 
        headers: {'Content-type': 'application/json'},
    }).then (res => {
        if(res.ok){
            return res.json();
        }
        throw new Error('Network response was not ok');
    }).then (task => {
        addEventListener(task.eventName, task.startDate, task.endDate, task.contributor);
    }).catch(error => {
        console.log('Error fetching tasks:', error);
        })
}

// strikethrough the task when it's done
function taskDone(taskId){
    fetch('https://67af311fdffcd88a6785de64.mockapi.io/api/v1/tasks/${taskId}', {
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({done: true})
    }).then(res => {
        if(!res.ok){
            throw new Error('Failed to update task');
        }
        return res.json();
    }).then(updatedTask => {
        let row = document.querySelector(`tr[data-id="${taskId}"]`);
        if (row) {
            updatedTask;
            row.style.textDecoration = "line-through";
        }
    }).catch(error => {
        console.error('Error marking task as done:', error);
    })
}// there is no update on the task !!! FIX IT

