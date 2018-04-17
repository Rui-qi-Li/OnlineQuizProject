<?php
//1.open json.file, 2.accept the POST data

    //load json file
    $data = file_get_contents('user.json');
    $json = json_decode($data);

    //accept data: json -> php object
    $sendData =  json_decode($_POST['sendData']);
    $id = $sendData->id;
    $page = $sendData->page;
    $record = $sendData->record;
    $score = $sendData->score;// 0 or 1
    
    //only add new data to json file
    //use isset() to check array index status
    if(isset(($json[$id]->history)[$page])){
        echo "data has alreay existed!Updating...\n";
        //update the current page record
        ($json[$id]->history)[$page]->record = $record;
        //update the current page score
        echo $score;
        ($json[$id]->history)[$page]->score = $score;
    }
    else{
        //* new data, save all of them to the history;
        ($json[$id]->history)[] = $sendData;
    }

     //write back to user.json file
     file_put_contents('user.json',json_encode($json));
     echo "save all new data successfully!\n";
    
?>