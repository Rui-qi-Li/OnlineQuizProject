<?php
     //load json file
     $data = file_get_contents('user.json');
     $json = json_decode($data);

     //login
     if(isset($_POST['password'])){
        $username =  $_POST['username'];
        $password =  $_POST['password'];

        //find the user
        $count = 0;
        foreach($json as $el){
            if($el->username == $username && $el->password == $password){
                $el->login = true;
                $count = 1;
                echo $el->id;
                break;
            }
        }
        if($count == 0)
            echo "wrong account";

     }
    // if(isset($_POST['']))
     if(isset($_POST['reset']) && isset($_POST['id'])){
         echo "reset working!\n";
         $id = $_POST['id'];
         $json[$id]->history = array();
     }
     if(isset($_POST['logout']) && isset($_POST['id'])){
        echo "logout working!\n";
        $id = $_POST['id'];
        $json[$id]->login = false;
        
     }
     //save back to user file
     file_put_contents('user.json',json_encode($json));
     //var_dump($json);
     //echo "php processing finish!"
?>