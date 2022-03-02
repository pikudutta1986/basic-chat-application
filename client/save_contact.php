<?php
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

include ('db.php');

$data = json_decode(file_get_contents('php://input'), true);
if(isset($data['initials']) && $data['initials']!='' && isset($data['name']) && $data['name']!='' && isset($data['email']) && $data['email']!='' && isset($data['message']) &&  $data['message']!='')
{
	$sql = "insert into contact (initials, name,email,message) values('".$data['initials']."', '".$data['name']."', '".$data['email']."', '".$data['message']."')";
	if($mysqli->query($sql))
	{
		$contacts = array();

		$sql = 'select * from contact order by contact_id desc';

		$query = $mysqli->query($sql);

		if($query)
		{
			while($row = mysqli_fetch_assoc($query)) 
			{
		        $contacts[] = $row;       
		    }
			// print_r($row);
		}
		$response = array('success'=>true, 'message' => 'Inserted successfully.', 'contacts' => $contacts);
	}
	else
	{
		$response = array('success'=>false, 'message' => 'Problem in query');
	}
	echo json_encode($response);
}
else
{
	$response = array('success' => false, 'message' => 'Please fill up all the fields');
	echo json_encode($response);
}
?>