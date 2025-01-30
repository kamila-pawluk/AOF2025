document.addEventListener('DOMContentLoaded', function(){
    createCalendar();
});

document.getElementById('addEventButton').addEventListener('click', function(){
   let event = document.getElementById('eventInput').value;
   let startDate = document.getElementById('startDateInput').toLocaleDateString();
   let endDate = document.getElementById('deadlineInput').toLocaleDateString();
   let contributor = dc
});


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