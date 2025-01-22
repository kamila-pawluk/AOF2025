//view.js

let guestBook = document.getElementById("messages");

function updateView(){
    let guestList = JSON.parse(localStorage.getItem('guestsTest')) || [];
    console.log("Is Array update:", Array.isArray(guestList));

    let html = /*HTML*/ `
    <table>
        <tr> 
            <th>Guest name</th>
            <th>Message</th>        
            <th>Date</th>        
            <th>Actions</th>        
        </tr>
        `;
        guestList.forEach(guest => {
            html += createHTMLRow(guest);
        });
    html += `</table>`;
    console.log("Guest list: ", guestList);
    guestBook.innerHTML = html;
    console.log("type guestList " , typeof guestList);
    }

    function createHTMLRow(guest){ 
    if(!guest.editMode){
        return /*HTML*/ `
            <tr>
                <td>${guest.name}</td>
                <td>${guest.message}</td>
                <td>${guest.date}</td>
                <td><button onclick="changeMessage(${guest})">Change message</button></td>
                <td><button onclick="removeMessage(${guest})">Remove message</button></td>
            </tr>
        `;
    }
    else {
        return /*HTML*/ `
        <tr>
            <td>${guest.name}</td>
            <td><input id="editMesage${guest}" type="text" value="${guest.message}"></td>
            <td>${guest.date}</td>
            <td><button onclick="editMessage(${guest})">Change message</button></td>
            <td><button onclick="removeMessage(${guest})">Remove message</button></td>
            <td>
                <button onclick="updateGuestsMessage(${guest})">Save</button>
            </td>
        </tr>
    `;
    } 
    }

    function editMessage(guest){
        guest.editMode = true;
        updateView();
    }

    function deleteGuestsStamp(guest){
        guestList.splice(guest, 1);
        updateView();
    }

    function updateGuestsMessage(guest){
        const message =  `editMessage${guest}`;
        const inputUpdatedMessage = document.getElementById(message);
        guest.message = inputUpdatedMessage.value;
        let savedGuests = JSON.parse(localStorage.getItem('guestsTest')) || [];
        savedGuests.splice(guest, )
        guest.editMode = false;
        updateView();
    }