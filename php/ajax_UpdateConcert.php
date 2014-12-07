<?php 

include "main.php";

	echo updateConcert($_GET['cName'], $_GET['cTitle'], $_GET['cVenue'], $_GET['cDateTime'], $_GET['cTicketLink']);

?>
