<?php 
	$SQLConnection = new mysqli("localhost", "root", "", "projectdb");

	//Add user music likes
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
		$Query = $SQLConnection->prepare("SELECT uLoginTime FROM users WHERE username=? AND password=?");
		$Query->bind_param("ss", $username, $password);
		$Query->execute();

		$result = $Query->get_result();

		//Return null, handle failed login attempt with javascript
		if(empty($result))
			return null;

		while($row = $result->fetch_assoc())
			$prevLoginTime = $row['uLoginTime'];

		$Query = $SQLConnection->prepare("UPDATE users SET uLoginTime=? WHERE username=? AND password=?");
		$Query->bind_param('sss', $timestamp, $username, $password);
		$Query->execute();	

		return $prevLoginTime;
	}

	function getAllBands()
	{
		$bandArray = array();

		global $SQLConnection;
		$Query = $SQLConnection->prepare("SELECT band.bandUsername, band.bname, musictype.musicName FROM band JOIN musictype ON band.musicPlaying = musicType.musicID");
		$Query->execute();
		$result = $Query->get_result();

		while($row = $result->fetch_assoc())
			array_push($bandArray, $row);

		return json_encode($bandArray);
	}

	function getAllConcerts()
	{
		$concertArray = array();

		global $SQLConnection;
		$Query = $SQLConnection->prepare("SELECT cTitle, cVenue, cDateTime, cName FROM concert");
		$Query->execute();
		$result = $Query->get_result();

		while($row = $result->fetch_assoc())
			array_push($concertArray, $row);

		return json_encode($concertArray);
	}

	function getUpcomingConcerts()
	{
		$upComingConcertArray = array();

		global $SQLConnection;
		$Query = $SQLConnection->prepare("SELECT DISTINCT concert.cTitle, concert.cVenue, concert.cDateTime
										  FROM concert 
										  WHERE cDateTime < DATE_ADD(CURDATE(), INTERVAL 30 DAY) AND cDateTime > CURRENT_TIMESTAMP()");
		$Query->execute();
		$result = $Query->get_result();

		while($row = $result->fetch_assoc())
			array_push($upComingConcertArray, $row);

		return json_encode($upComingConcertArray);
	}

	function getUsersFeed()
	{
		//Return users who are have attended or will attend a concert
		global $SQLConnection;
		$usersFeedArray = array();

		$Query = $SQLConnection->prepare("SELECT users.uName, attend.rating, attend.attended, attend.review, concert.cTitle  
										  FROM attend
										  JOIN users on attend.username = users.username
										  JOIN concert on attend.cname = concert.cname;");
		$Query->execute();
		$result = $Query->get_result();

		while($row = $result->fetch_assoc())
			array_push($usersFeedArray, $row);

		return json_encode($usersFeedArray);		
	}

	function getAllUsers()
	{
		global $SQLConnection;
		$allUserArray = array();
		$usernameArray = array();

		$Query = $SQLConnection->prepare("SELECT uName, users.username, musictype.musicName, musicsubtype.musicSubName
										  FROM users
										  JOIN musicLike ON musicLike.username = users.username
										  JOIN musictype ON musicLike.musicID = musictype.musicID
										  JOIN musicsubtype ON musicLike.musicID = musicsubtype.musicID");
		$Query->execute();

		$result = $Query->get_result();

		while($row = $result->fetch_assoc())
		{
			array_push($allUserArray, $row);
			array_push($usernameArray, $row['username']);
		}

		$uniqueUser = array_unique($usernameArray);

		$musicType = "";
		$Name = "";
		
		$finalArray = array();
		$jsonArray = array();

		foreach($uniqueUser as $username)
		{
			$musicSubArray = array();
			foreach($allUserArray as $user)
			{
				if($username == $user['username'])
				{
					$musicType = $user['musicName'];
					$name = $user['uName'];
					array_push($musicSubArray, $user['musicSubName']);
				}
			}
			$finalArray['musicName'] = $musicType;
			$finalArray['uName'] = $name;
			$finalArray['username'] = $username;
			$finalArray['musicLikes'] = $musicSubArray;

			array_push($jsonArray, $finalArray);
		}

		return json_encode($jsonArray);
	}

	function searchForUser($searchText)
	{
		//Search for username

		//Search for music likes
	}

	function addBand($bandUsername, $bName, $bEmail, $bCity, $bURL, $musicLike)
	{
		global $SQLConnection;
		$timestamp = date('Y-m-d H:i:s');

		$Query = $SQLConnection->prepare("INSERT INTO band VALUES(?, ?, ?)");
		$Query->bind_param('sssssi', $bandUsername, $bName, $bEmail, $bCity, $bURL, $musicLike);
		$Query->execute();
		$result = $Query->get_result();

		return $result;
	}

	//LoggedInUser is considered the followee
	//FollowingUser is the user that will be followed
	function followUser($loggedInUser, $followingUser)
	{
		global $SQLConnection;
		$timestamp = date('Y-m-d H:i:s');

		$Query = $SQLConnection->prepare("INSERT INTO follow VALUES(?, ?, ?)");
		$Query->bind_param('sss', $loggedInUser, $followingUser, $timestamp);
		$Query->execute();
		$result = $Query->get_result();

		return $result;
	}

	function addBandToUser($username, $bandUsername)
	{
		global $SQLConnection;
		$timestamp = date('Y-m-d H:i:s');

		$Query = $SQLConnection->prepare("INSERT INTO fan VALUES(?, ?)");
		$Query->bind_param('ss', $username, $bandUsername);
		$Query->execute();
		$result = $Query->get_result();

		return $result;	
	}

	function scheduleConcert($username, $concertName)
	{
		global $SQLConnection;

		$Query = $SQLConnection->prepare("INSERT INTO attend VALUES(?, ?, NULL, 0, NULL)");
		$Query->bind_param('ss', $username, $concertName);
		var_dump($Query);
		$Query->execute();
		$result = $Query->get_result();

		return $result;		
	}

	function getConcertsForUser($username)
	{
		$userConcerts = array();

		global $SQLConnection;
		$Query = $SQLConnection->prepare("SELECT attend.username, cTitle, rating, attended, review FROM attend JOIN concert ON attend.cname=concert.cname WHERE username = ?");
		$Query->bind_param('s', $username);
		$Query->execute();
		$result = $Query->get_result();

		while($row = $result->fetch_assoc())
			array_push($userConcerts, $row);

		return json_encode($userConcerts);		
	}

	function getCurrentFriends($username)
	{
		$userArray = array();

		global $SQLConnection;
		$Query = $SQLConnection->prepare("SELECT followee, uName FROM follow JOIN users ON users.username = follow.followee WHERE follower = ?");
		$Query->bind_param('s', $username);
		$Query->execute();
		$result = $Query->get_result();

		while($row = $result->fetch_assoc())
			array_push($userArray, $row);

		return json_encode($userArray);			
	}
?>
