const urlBase = 'http://64.225.60.52/LAMPAPI';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() 
{
    
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    // document.getElementById("loginResult").innerHTML = "";

    let tmp = {login: login, password: password};
    let jsonPayload = JSON.stringify(tmp);
    
    let url = urlBase + '/Login.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try 
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
        
                if (userId < 1) 
                {        
                    // document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }
        
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                localStorage.setItem("userId", userId);

                saveCookie();
    
                window.location.href = "html/contacts.html";
            }
        };
        xhr.send(jsonPayload);
    } catch(err) 
    {
        // document.getElementById("loginResult").innerHTML = err.message;
    }
}

function saveCookie()
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));  
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() 
{
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for(var i = 0; i < splits.length; i++) 
    {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if(tokens[0] == "firstName") 
        {
            firstName = tokens[1];
        } else if(tokens[0] == "lastName") 
        {
            lastName = tokens[1];
        } else if(tokens[0] == "userId")
        {
            userId = parseInt(tokens[1].trim());
        }
    }
    
    if(userId < 0) 
    {
        window.location.href = "index.html";
    } else 
    {
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

function doLogout() 
{
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function doRegister() 
{
    
    let firstName = document.getElementById("registerFirstName").value;
    let lastName = document.getElementById("registerLastName").value;
    let login = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;

    // document.getElementById("registerResult").innerHTML = "";

    let tmp = {FirstName: firstName, LastName: lastName, login: login, password: password};
    let jsonPayload = JSON.stringify(tmp);
    
    let url = urlBase + '/AddUser.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try 
    {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) 
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error === "") 
                {        
                    window.location.href = "../index.html";
                } else 
                {
                    // document.getElementById("registerResult").innerHTML = jsonObject.error;
                }
            }
        };
        xhr.send(jsonPayload);
    } catch(err) 
    {
        // document.getElementById("registerResult").innerHTML = err.message;
    }
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

                    text += "<tr id='row" + i + "'>"
                    text += "<td id='id" + i + "'><span>" + temp[0] + "</span></td>";
                    text += "<td id='first_Name" + i + "'><span>" + temp[1] + "</span></td>";
                    text += "<td id='last_Name" + i + "'><span>" + temp[2] + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + temp[3] + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + temp[4] + "</span></td>";
                    text += "<td>" +
                        "<button type='button' id='edit_button" + i + "'onclick='editRow(" + temp[0] + ", " + temp[1] + ", " + temp[2] + ", " + temp[3] + ", " + temp[4] + ")'>" + "<span class='bi-pencil-square'></span>" + "</button>" +
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

function editRow(id, firstName, lastName, phone, email) {

    document.getElementById("offCanvasRight").toggle();

}