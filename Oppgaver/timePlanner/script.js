document.addEventListener('DOMContentLoaded', function(){
    createCalendar();
});

document.getElementById('addEventButton').addEventListener('click', function(){
    createEventCard();
});

function createEventCard (){
    let eventName = document.getElementById('eventInput').value;
    let startDate = document.getElementById('startDateInput').value;
    let endDate = document.getElementById('deadlineInput').value;
    let contributor = document.getElementById('contributorName').value;

    // var card  = /* HTML*/ `
        // <td> <span class="eventCard" id="eventCard">Event</span></td>`;

   addEventToTheList(eventName, startDate, endDate, contributor);
   createNewTask();

}

function addEventToTheList (eventName, startDate, endDate, contributor){
    const contributorColor = {
        "John" : "#ffcccc",
        "Mike": "#ccddcc",
        "Anna": "#ccccff",
        "default": "#f0f0f0"
    };

    let bgColor = contributorColor[contributor] || contributorColor["default"];

    let newRow = /*HTML*/ `
    <tr style="background-color: ${bgColor}" data-id="${task.id}">
        <td id="eventName">${task.eventName}</td>
        <td id="startDate">${task.startDate}</td>
        <td id="endDate">${task.endDate}</td>
        <td><button onclick="taskDone(${task.id})">Change status</button></td>
    </tr> `;

    document.getElementById('taskTable').innerHTML += newRow;
}

function createCalendar(){
    let date = new Date();
    let monthNow = date.getMonth();

    let table = /*HTML*/`
     <table id="calendar">
        <thead>
            <tr>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
                <th>Sunday</th>
            </tr>
        </thead>
        <tbody>`

        date.setDate(1);

    let firstDay = getDay(date);
    table += `<tr>`;
    for (let i = 0; i < firstDay; i++){
        table += `<td></td>`;
    }

    while (date.getMonth() == monthNow){
        table += `<td> ${date.getDate()} </td>`;

        if(getDay(date) % 7 == 6){
            table += `</tr><tr>`;
        }

        date.setDate(date.getDate() + 1);
    }

    if(getDay(date) != 0){
        for(let i = getDay(date); i < 7; i++){
            table += `<td></td>`;
        }
    }

    table += `</tr></tbody></table>`;
    document.getElementById('container').innerHTML = table;
}

function getDay(date){
    let day = date.getDay();
    return day === 0 ? 6 : day -1;
}