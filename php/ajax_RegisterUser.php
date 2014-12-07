<?php 

include "main.php";

	echo registerUser($_GET['username'], $_GET['password'], $_GET['uName'], $_GET['uEmail'], $_GET['uDOB'], $_GET['uCity'], $_GET['selectfrom']);

?>
