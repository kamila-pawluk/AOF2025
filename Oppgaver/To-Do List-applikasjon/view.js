var tasksTable = document.getElementById('tasksTable');
const filterSelect = document.querySelector('select');

function init(){
    renderTask(tasks);
    filterSelect.addEventListener('change', filterTasks);
}

function renderTask(taskList){
    let html = /*HTML*/ ` 
        <tr>
            <th>Task</th>
            <th>Done</th>
            <th>Actions</th>
        </tr>
     `;
    for (let i = 0; i < taskList.length; i++) {
        html += createHtmlRow(i, taskList[i]);
    }
    tasksTable.innerHTML = html;
}

function createHtmlRow(i, task){
    const doneHtml = task.done ? 'checked' : '';
    return /*HTML*/ `
        <tr>
            <td>${task.taskDescription}</td>
            <td><input onchange="toogleTaskDone(${task.id})" type="checkbox" ${doneHtml}/></td>
            <td><button onclick="removeTask(${task.id})">Remove</button></td>
        </tr>`;
}