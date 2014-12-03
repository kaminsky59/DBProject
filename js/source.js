/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function()
{
    $('#select-from').multiSelect({ selectableOptgroup: true });
});

function registerUser()
{
    var test = $('#registerForm').serialize();
}

function loginUser()
{
    var test = '';
}