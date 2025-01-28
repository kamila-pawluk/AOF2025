//view.js


function updateView(guestList = null){
    let guestBook = document.getElementById("guestBook");
    let guests = guestList || JSON.parse(localStorage.getItem('guestsTest')) || [];
    console.log("Is Array update:", Array.isArray(guestList));
    guestBook.innerHTML = '';

    
    guests.forEach(guest => {
        guestBook.innerHTML += createHTMLRow(guest);
    });
    console.log("Guest list: ", guestList);
    console.log("type guestList " , typeof guestList);
    }

    function createHTMLRow(guest){ 
    if(!guest.editMode){
        return /*HTML*/ `
            <tr>
                <td>${guest.name}</td>
                <td>${guest.message}</td>
                <td>${guest.date}</td>
                <td><button onclick="editMessage(${guest.id})">Change message</button></td>
                <td><button onclick="removeGuestsEntry(${guest.id})">Remove message</button></td>
            </tr>
        `;
    }
    else {
        return /*HTML*/ `
        <tr>
            <td>${guest.name}</td>
            <td><input id="editMessageWithInput" type="text" value="${guest.message}"></td>
            <td>${guest.date}</td>
            <td>
                <button onclick="updateChanges(${guest.id})">Save</button>
            </td>
        </tr>
    `;
    } 
    }

    