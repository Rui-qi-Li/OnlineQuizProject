<?php
    //load json file
    $data = file_get_contents('user.json');
    $json = json_decode($data);
    $length = count($json);
    $temp = new stdClass();

    //signup
    if(isset($_POST['password'])){
        $username =  $_POST['username'];
        $password =  $_POST['password'];

        //save the user
        $temp->id =  $length;
        $temp->username = $username;
        $temp->password = $password;
        $temp->login = true;
        $temp->history = array();

        //push to $json
        $json[] = $temp;
    }

    //save back to user file
    file_put_contents('user.json',json_encode($json));
    echo ($length);
?>