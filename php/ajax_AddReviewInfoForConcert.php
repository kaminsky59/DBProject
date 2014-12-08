<?php 

include "main.php";

	echo AddReviewInfoForConcert($_GET['username'], $_GET['concertName'], $_GET["rating"], $_GET["review"]);

?>
