/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function()
{
    $('#select-from').multiSelect({ selectableOptgroup: true });

    //Load home screen upcoming events



    //Load info about your friends
});

function registerUser()
{
    var test = $('#registerForm').serialize();
}

function loginUser()
{
    //Call PHP for SQL checking of login
    $.ajax({
    	url:"php/ajax_LoginUser.php",
    	data: $("#loginForm").serialize()
    }).done(function(result)
    {
    	if(result == 'null')
        {
            $("#loginFailed").css('display','inline');
        }
        else
        {
            $("#loginBlock").css('display', 'none');
            $("#loggedInBlock").css('display', 'initial');
        }
    });

    //Change the div of the login and register to 'Welcome <Name>'   
}

function loadBandPage()
{
    $.ajax({
        url: "php/ajax_GetAllBands.php",
        dataType: "json"
    }).done(function(result)
    {
        var html = "";

        for(var i = 0; i < result.length; i++)
        {
            html += "<tr><td>" + result[i]["bname"] + "</td><td>" + result[i]["musicName"] + "</td><td><button name=\"addButton\">Add</button></td><td><button name=\"editButton\">Edit</button></td></tr>";
        }

        $("#bandSearchTable").append(html);
    });
}

function loadHomePage()
{
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