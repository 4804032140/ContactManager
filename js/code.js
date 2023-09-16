const urlBase = 'http://64.225.60.52/LAMPAPI';

function showAddOffcanvas() {

    document.getElementById("contactAddResult").innerHTML = "";
    document.getElementById("contactUpdateResult").innerHTML = "";

    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";

    document.getElementById("editContactButton").style.display = "none";
    document.getElementById("addContactButton").style.display = "block";

    var offcanvas = document.getElementById("offcanvasRight");
    var bsOffcanvas = new bootstrap.Offcanvas(offcanvas)

    bsOffcanvas.show();

}

function addContacts() {
    var userId = localStorage.getItem("userId");

    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;

    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        userId: userId
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactAddResult").innerHTML = "Contact has been added";

                document.getElementById("firstName").value = "";
                document.getElementById("lastName").value = "";
                document.getElementById("phone").value = "";
                document.getElementById("email").value = "";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

function searchContacts() {
    let search = document.getElementById("searchInput").value;

    let contactList = "";

    let tmp = { name: search, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.php'; 

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {        

                var text = "";

                // document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);

                console.log(jsonObject);

                for (let i = 0; i < jsonObject.results.length; i++) {
                    temp = jsonObject.results[i].split(",");

                    defNum = deformatNum(temp[3]);

                    text += "<tr id='row" + i + "'>"
                    text += "<td id='id" + i + "'><span>" + temp[0] + "</span></td>";
                    text += "<td id='first_Name" + i + "'><span id='fn" + temp[0] + "'>" + temp[1] + "</span></td>";
                    text += "<td id='last_Name" + i + "'><span id='ln" + temp[0] + "'>" + temp[2] + "</span></td>";
                    text += "<td id='phone" + i + "'><span id='phone" + temp[0] + "'>" + temp[3] + "</span></td>";
                    text += "<td id='email" + i + "'><span id='email" + temp[0] + "'>" + temp[4] + "</span></td>";
                    text += "<td>" +
                        "<button type='button' id='edit_button" + i + "'onclick='editRow(" + temp[0] + ")'>" + "<span class='bi-pencil-square'></span>" + "</button>" +
                        "<button type='button' onclick='deleteRow(" + temp[0] + ")'>" + "<span class='bi-trash-fill'></span> " + "</button>" + "</td>";
                    text += "<tr/>"
                }

                document.getElementById("table").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        // document.getElementById("contactSearchResult").innerHTML = err.message;
    }

}

function deleteRow(id) {
    let tmp = { contactId: id };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.php'; 

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                searchContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch(err) {

    }
}

function editRow(id) {

    document.getElementById("contactAddResult").innerHTML = "";
    document.getElementById("contactUpdateResult").innerHTML = "";

    firstName = document.getElementById("fn" + id).innerHTML;
    lastName = document.getElementById("ln" + id).innerHTML;
    phone = document.getElementById("phone" + id).innerHTML;
    email = document.getElementById("email" + id).innerHTML;

    var offcanvas = document.getElementById("offcanvasRight");
    var bsOffcanvas = new bootstrap.Offcanvas(offcanvas)

    bsOffcanvas.show();

    document.getElementById("contactId").value = id;
    document.getElementById("firstName").value = firstName;
    document.getElementById("lastName").value = lastName;
    document.getElementById("phone").value = phone;
    document.getElementById("email").value = email;

    document.getElementById("offcanvasRightLabel").innerHTML = "Edit Contact:";
    document.getElementById("editContactButton").style.display = "block";
    document.getElementById("addContactButton").style.display = "none";

}

function updateContacts() {

    var id = document.getElementById("contactId").value;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;

    let tmp = { 
        contactId: id,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/UpdateContact.php";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactUpdateResult").innerHTML = "Contact successfully updated";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {

    }
}

function deformatNum(number) {

    var defNum;

    defNum = number.replace("(", "");
    defNum = defNum.replace(")", "");
    defNum = defNum.replace(" ", "");

    return defNum;

}

function doLogout() 
{
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}