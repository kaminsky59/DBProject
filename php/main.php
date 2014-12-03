<?php 
	$SQLConnection = new mysqli("localhost", "root", "", "sandwichDB");

	function registerUser($username, $password, $uName, $uDOB, $uCity)
	{
		$trustLevel = 1;
		global $SQLConnection;
		$timestamp = date('Y-m-d H:i:s');

		$Query = $SQLConnection->prepare("INSERT INTO users (username, uName, uDOB, uEmail, uCity, trust, uLoginTime)
										  VALUES (?, ?, ?, ?, ?, ?, ?)");
		$Query->bind_param('sssssis', $username, $password, $uName, $uDOB, $uCity, $trustLevel, $timestamp);
		$Query->execute();
	}

	function loginUser($username, $password)
	{
		global $SQLConnection;
		$timestamp = date('Y-m-d H:i:s');
		$prevLoginTime = '';
		
		//Check previous login Time
		$Query = $SQLConnection->prepare("SELECT uLoginTime FROM users where username=? AND password=?");
		$Query->bind_param("ss", $username, $password);
		$Query->execute();

		$result = $Query->get_result();

		//Return null, handle failed login attempt with javascript
		if(empty($result))
			return null;

		while($row = $result->fetch_assoc())
			$prevLoginTime = $row['uLoginTime'];

		$Query = $SQLConnection->prepare("INSERT INTO users (uLoginTime)
										  VALUES (?)");
		$Query->bind_param('s', $timestamp);
		$Query->execute();	

		return $prevLoginTime;
	}
?>
