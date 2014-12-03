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
            html += "<tr><td>" + result[i]["bname"] + "</td><td>" + result[i]["musicName"] + "</td><td><button name=\"addButton\">Add</button></td></tr>";
        }

        $("#bandSearchTable").append(html);
    });
}