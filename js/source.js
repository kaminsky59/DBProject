/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function()
{
    //Load home screen upcoming events



    //Load info about your friends
});

function loadRegisterPage()
{
    $.ajax({
        url: "php/ajax_LoadRegisterMusic.php",
        dataType: "json"
    }).done(function(result)
    {
        var html = "";
        for(var i = 0; i < result.length; i++)
        {
            html += "<optgroup label=\"" + result[i]['musicName'] + "\">";

            for(var j = 0; j < result[i]['musicSubType'].length; j++)
            {
                html+= "<option value=\"musicID_" + result[i]['musicID'] + "_" + result[i]['musicSubType'][j] + "\">" + result[i]['musicSubType'][j] + "</option>";
            }

            html += "</optgroup>";
        }
        $("#select-from").append(html);

        $('#select-from').multiSelect({ selectableOptgroup: true });
    });
}

function registerUser()
{
    var test = $('#registerForm').serialize();

    $.ajax({
        url: "php/ajax_RegisterUser.php",
        data: $('#registerForm').serialize()
    }).done(function()
    {
        alert("User Register! Please log in");
    })
}

function loginUser()
{
    var username = $("#username").val();
    //Call PHP for SQL checking of login
    $.ajax({
    	url:"php/ajax_LoginUser.php",
    	data: $("#loginForm").serialize()
    }).done(function(result)
    {
    	if(result == '')
        {
            $("#loginFailed").css('display','inline');
        }
        else
        {
            $("#loginBlock").css('display', 'none');
            $("#loggedInBlock").css('display', 'initial');

            document.cookie = "username=" + username;
        }
    });
}

function logOutUser()
{
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC"; 
    location.reload();
}

function loadBandPage()
{
    isUserLoggedIn();

    $.ajax({
        url: "php/ajax_GetAllBands.php",
        dataType: "json"
    }).done(function(result)
    {
        var html = "";

        for(var i = 0; i < result.length; i++)
        {
            html += "<tr><td>" + result[i]["bname"] + "</td><td>" + result[i]["musicName"] + "</td><td><form action=\"aBand_Main.html\"><button type=\"Submit\" name=\"bandUsername\" value=\"" + result[i]['bandUsername'] + "\">GO TO</button></form></td></tr>";
        }

        $("#bandSearchTable").append(html);
    });
}

function isUserLoggedIn()
{
    var cookies = document.cookie;

    if(document.cookie)
    {
        //Hide login div - show welcome div
        $("#loginBlock").css('display', 'none');
        $("#loggedInBlock").css('display', 'initial');
    }
}

function loadHomePage()
{
    
    isUserLoggedIn();

    //Get upcoming concerts
    $.ajax({
        url: "php/ajax_GetUpcomingConcerts.php",
        dataType: "json"
    }).done(function(result)
    {
        var html = "";

        for(var i = 0; i < result.length; i++)
        {
            html += "<tr><td>" + result[i]["cTitle"] + "</td><td>" + result[i]["cVenue"] + "</td><td>" + result[i]["cDateTime"] + "</td></tr>";
        }

        $("#upcomingTable").append(html);
    });

    //Get users feed
    $.ajax({
        url: "php/ajax_GetUsersFeed.php",
        dataType: "json"
    }).done(function(result)
    {
        var html = "";

        for(var i = 0; i < result.length; i++)
        {
            var attended = "";
            var review = "";
            var rating = "";

            if(result[i]['attended'])
                attended = result[i]['attended'];
            if(result[i]['review'])
                review = result[i]['review'];
            if(result[i]['rating'])
                rating = result[i]['rating'];
            html += "<tr><td>" + result[i]["uName"] + "</td><td>" + result[i]["cTitle"] + "</td><td>" + attended + "</td><td>" + rating + "</td><td>" + review + "</td></tr>";
        }

        $("#userFeedTable").append(html);
    });
}

function loadConcertPage()
{
    isUserLoggedIn();

    $.ajax({
        url: "php/ajax_GetAllConcerts.php",
        dataType: "json"
    }).done(function(result)
    {
        var html = "";

        for(var i = 0; i < result.length; i++)
        {
           html += "<tr><td>" + result[i]["cTitle"] + "</td><td>" + result[i]["cVenue"] + "</td><td>" + result[i]["cDateTime"] + "</td><td>" + "</td><td><form action=\"aConcert_Main.html\"><button type=\"Submit\" name=\"cName\" value=\"" + result[i]['cName'] + "\">GO TO</button></form></td></tr>";
        }

        $("#concertSearchTable").append(html);
    });
}

function loadUserPage()
{
    isUserLoggedIn();

    $.ajax({
        url:"php/ajax_GetAllUsers.php",
        dataType: "json"
    }).done(function(result)
    {
        var html = "";

        for(var i = 0; i < result.length; i++)
        {
            var musicLikesSerialized = '';

            for(var j = 0; j < result[i]['musicLikes'].length; j++)
            {
                musicLikesSerialized += result[i]['musicLikes'][j] + ", ";
            }

            html += "<tr username=\"" + result[i]['username'] + "\"><td>" + result[i]['uName'] +  "</td><td>" + musicLikesSerialized + "</td><td><form action=\"aFriend_main.html\"><button name=\"followeeUser\" value=\"" + result[i]['username'] + "\">View</button></form></td></tr>";
        }

        $("#friendSearchTable").append(html);
    });
}

function getUsernameFromCookie()
{
    var usernameCookie = document.cookie;
    name = usernameCookie.split('=')[0];
    value = usernameCookie.split('=')[1];

    return value;
}

function addBand(bandName)
{
    // /.attr('id')
    var username = getUsernameFromCookie();

    //Get band username

    $.ajax({
        url: "php/ajax_AddBandToUser.php",
        data: "username=" + username + "&bandName=" + bandName
    }).done();
}

function addConcert(concertName)
{
    var username = getUsernameFromCookie();

    $.ajax({
        url: "php/ajax_ScheduleConcert.php",
        data: "username=" + username + "&concertName=" + concertName
    }).done();
}

function getConcertForUser(username, tableID)
{
    $.ajax({
        url: "php/ajax_GetConcertForUser.php",
        data: "username=" + username,
        dataType: "json"
    }).done(function(result)
    {
        var html = "";

        for(var i = 0; i < result.length; i++)
        {
            var rating = "";
            var review = "";
            var attended = "Not Yet!";

            if(result[i]["rating"] != null)
            {
                rating = result[i]["rating"]
            }

            if(result[i]["review"] != null)
            {
                review = result[i]["review"]
            }

            if(result[i]["attended"] == 1)
            {
                attended = "Yes I did :)";
            }

            html += "<tr><td>" + result[i]["cTitle"] + "</td><td>" + attended + "</td><td>" + rating + "</td><td>" + review + "</td></tr>";
        }

        $("#" + tableID).append(html);
    });
}

function loadUserAccountPage()
{
    isUserLoggedIn();

    var username = getUsernameFromCookie();

    getConcertForUser(username, "userConcertTable");

    $.ajax({
        url: "php/ajax_GetCurrentFriends.php",
        data: "username=" + username,
        dataType: "json"
    }).done(function(result)
    {
        var html = "";

        for(var i = 0; i < result.length; i++)
        {
           html += "<tr><td>" + result[i]["uName"] + "</td><td><form action=\"aFriend_main.html\"><button type=submit name=\"followeeUser\" value=\"" + result[i]['followee'] + "\">View</button></td><td>" +"</td><td>" + "</td></tr>";
        }

        $("#friendFeedTable").append(html);
   });
}

function loadSelectedBandPage()
{
    isUserLoggedIn();
    var bandusername = getUrlParameter("bandUsername");

    $("#likeBandButton").attr("onclick", "javacript:addBand(\"" + bandusername + "\")");
    //Get Info about band
    $.ajax({
        url: "php/ajax_GetSelectedBand.php",
        dataType: "json",
        data: "bandusername=" + bandusername
    }).done(function(result)
    {
        $("#bUsername").val(bandusername);
        $("#bName").val(result[0]['bname']);
        $("#bEmail").val(result[0]['bandEmail']);
        $("#bCity").val(result[0]['bandCity']);
        $("#bURL").val(result[0]['bandURL']);
    });
}

function updateBand()
{
    $.ajax({
        url: "php/ajax_updateBand.php",
        data: $("#newBandForm").serialize()
    }).done(function(result)
    {
        alert("Band has been updated");
        location.reload();
    });
}

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function loadSelectedConcertPage()
{
    isUserLoggedIn();
    var concertName = getUrlParameter("cName");

    //Check if user is scheduled to attend concert -- change button to 'attending' (RED COLOR)

    $("#attendBandButton").attr("onclick", "javacript:addConcert(\"" + concertName + "\")");
    //Get Info about band
    $.ajax({
        url: "php/ajax_GetSelectedConcert.php",    
        dataType: "json",
        data: "cName=" + concertName
    }).done(function(result)
    {
        $("#cName").val(concertName);
        $("#cTitle").val(result[0]['cTitle']);
        $("#cVenue").val(result[0]['cVenue']);
        $("#cDateTime").val(result[0]['cDateTime']);
        $("#cTicketPrice").val(result[0]['cTicketPrice']);
        $("#cTicketLink").val(result[0]['cTicketLink']);
    });
}

function updateConcert()
{
    $.ajax({
        url: "php/ajax_UpdateConcert.php",
        data: $("#newConcertForm").serialize()
    }).done(function(result)
    {
        alert("Concert has been updated");
        location.reload();
    });
}         

function loadFriendsPage()
{
    var followeeUser = getUrlParameter("followeeUser");

    isUserLoggedIn();

    getConcertForUser(followeeUser, "friendConcertTable");

    $.ajax({
        url: "php/ajax_GetUserInfo.php",
        dataType: "json",
        data: "aUser=" + followeeUser
    }).done(function(result)
    {
        $("#followerUser").html(" " + followeeUser);
        $("#userFullName").html(" (" + result[0]['uName'] + ")");
    }); 
}