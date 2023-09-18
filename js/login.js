const urlBase = 'http://cop4331group2.com/LAMPAPI';

function doLogin() 
{
    
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    document.getElementById("loginNotice").innerHTML = "";

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
                    document.getElementById("loginNotice").innerHTML = "* User/Password combination incorrect";
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
        document.getElementById("loginNotice").innerHTML = "* " + err.message;
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