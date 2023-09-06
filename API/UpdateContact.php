<?php
	$inData = getRequestInfo();
	
	$contact = $inData["Contacts"];
	$userId = $inData["Users"];

	$conn = new mysqli("localhost", "root", "APasswordFor6People", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET Name = ? WHERE UserID = ?");
		$stmt->bind_param("ss", $contact, $userId);
		$stmt->execute();

		if ($stmt->affected_rows > 0) {
			$stmt->close();
			$conn->close();
			returnWithError("");
		} else {
			returnWithError("Contact not found or update failed.");
		}
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
