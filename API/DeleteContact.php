<?php
	$inData = getRequestInfo();
	
	$userId = $inData["Users"]; 
    
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID = ?");
		$stmt->bind_param("i", $userId);
		$stmt->execute();

		if ($stmt->affected_rows > 0) {
			$stmt->close();
			$conn->close();
			returnWithError("");
		} else {
			returnWithError("Contact not found or deletion failed.");
		}
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type
