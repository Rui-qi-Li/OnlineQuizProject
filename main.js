var main = function(){
    var count = -1;
    var temp,record,score,result;
    var imgEle = $('.yogocard').find('img');
    var correctAns = "default";

    //session
    var loginUser="";
    var loginPwd="";
    var id;

    //btn behaviour control 
    $('.next').on('click',getNext);
    $('.prev').on('click',getPrev);
    $('.submit').on('click',getSubmit);
    $('.historyBtn').on('click',getHistory);
    $('.resetBtn').on('click',Replay);
    $('.start').on('click',getStart);

    //menu behaviour control
    if(id != undefined){
        $('.loginNav').hide();$('.signupNav').hide();$('.logoutNav').show();
    }
    else{
        $('.loginNav').show();$('.signupNav').show();$('.logoutNav').hide();            
    }
  
    $('.loginNav').on('click',function(){
        if($('.signup').show())
            $('.signup').hide()
        $('.login').slideToggle();
    })
    $('.signupNav').on('click',function(){
        if($('.login').show())
            $('.login').hide()
        $('.signup').slideToggle();
    })
    $('.logoutNav').on('click',function(){
        $('.logout').slideToggle();
    })

    var display = function(){
        imgEle.attr('src',temp.url);
        console.log(count+" : page number");
        $('.question').text(temp.question);
        //.each is sync 
        $('.answer li').each(function(index){
            //empty the contents before insert
            $(this).empty();
            var input = $('<input>',{
                type:'radio',
                class:'form-check-input',
                id:'answer'+index,
                name:'ans'
            }).appendTo($(this));
            $('<label>',{for:'answer'+index,class:'form-check-input',text:temp.answer[index],style:'margin-left:10px;'}).appendTo($(this));
            //set the correct answer globally
            correctAns = temp.correct;
        });//each
    };
    var buttonShow = function(n){
        switch(n){
            case 0:
            $('.next').show(); $('.prev').hide(); $('.submit').hide();
            break;//don't forget "break"
            case 9:
            $('.next').hide(); $('.prev').show(); $('.submit').show();
            break;
            default:
            $('.next').show(); $('.prev').show(); $('.submit').hide();
        }
    };
    //listen for selected status and current answer
    var histroySave = function(correctAns){
        record = $('input[type=radio]:checked').next().text();
        //save score
        score = 0;
        if(record == correctAns){
            score = 1;
        }
        //save selected
        //dump JSON file to browser to edit, then send it back to php
        //send a object to php,use JSON.stringify, or it will turn to array
        //when post: saveJson.php?page=count&record=record
        $.post('saveJson.php',{sendData:JSON.stringify({"id":id,"page":count,"record":record,"score":score})}).done(function(res){
            console.log(res);

        });
    }

    //read the histroy
    var histroyRead = function(){
        $('.answer').show();
        $('.alert-warning').hide();
        $.getJSON('user.json',function(data){
            //only read under EXISTED status
            if( (data[id].history)[count] ){
                record = (data[id].history)[count].record;
                console.log(record);
                $('input[type=radio]').each(function(index, el){
                    if($(this).next().text() == record ){
                        $(this).attr('checked',true);
                        return false;
                    }
                });
            }//if
        })
    }
    function getStart(){
        console.log(id);
        $.getJSON('user.json',function(data){
            if(id != undefined){
                $('.alert-danger').hide();
                $('.start').hide();
                count = -1;
                getNext();
            }
            else
                $('.alert-danger').show();
        })
    }

    function getNext(){
        //1. save the score on the current page
        if(count>-1)
            histroySave(correctAns);
        //2. display the next page
        $.getJSON("quiz.json",function(data){
            if(count<9){
                temp = data[++count];
                display();
            }
            //read the histroy
            histroyRead();
            //show button
            buttonShow(count);
        });
    }

    function getPrev(){
        histroySave(correctAns);
        $.getJSON("quiz.json",function(data){
            if(count>0){
                temp = data[--count];
                display();
            }
            histroyRead()
            buttonShow(count);
        });
    }

    var submitPanel = function(snapshot,result){
        console.log(result);
        $('.answer').hide();$('.submit').hide();$('.prev').hide();
        $('.question').html("<p>Congratulation <strong>"+snapshot.username+"</strong>!<br><br>You have finished all the questions!<br>Your have <strong>"+result+"</strong> correct answers!</p>")
        $('.btn-group').show();
    }
    function getSubmit(){
        histroySave(correctAns);
        $.getJSON('user.json',function(snapshot){
            console.log("submit working!")
            result = 0;
            var end = (snapshot[id].history).length - 1;
            //check if less than 5
            var filterData = $.map(snapshot[id].history,function(el){
                return (el.record?1:null);
            })
            if(filterData.length < 5)
                $('.alert-warning').show();
            else{
                $('.alert-warning').hide();
                $.each(snapshot[id].history,function(index, el){
                    result += el.score;
                    if(index == end){
                        submitPanel(snapshot[id],result);
                    }
                });
            }
        });
    }//getSubmit

    function getHistory(){
        $.getJSON('user.json',function(res){
            $('.historyList').show();
            var total = res[id].history;
            $.each(total,function(index,el){
                var node = $('<div>');
                node.append('<p>Question '+(index+1)+' :<br>Your answer is : '+el.record+'<br>Score : '+el.score+'</p>')
                node.find('p').css({
                    'font-size':'15px',
                    'color':'darkolivegreen'
                });
                $('.historyList').append(node);
            })
        })
    }
    var resetPanel = function(){
        $('.start').show();
        $('img').attr('src','');
        $('.historyList').hide();$('.reviewBtn').hide();
        $('.question').html('<p>Welcome to the Yoga quiz !<br>Please <strong>login/register</strong> first</p>');
    }
    function Replay(){
        $.post('authentication.php',{reset:true,id:id},function(res){
            console.log(res);
            if(confirm("Do you want to reset the quiz?")){
                alert("The history has been cleared!");
                resetPanel();
            }
        });
    }
    var signupPanel = function(){
        $('.alert-danger').hide();
        $('.signup').hide();
        $('.loginNav').hide();
        $('.signupNav').hide();
        $('.logoutNav').show();
    }
    $('#signupForm').submit(function(event){
        event.preventDefault();
        //serialize: name=name&password=password
        $.post('signup.php',$(this).serialize()).done(function(res){
            id = parseInt(res)
            console.log("sign up sucess"+id);
            signupPanel();
        })
    })

    var loginPanel = function(){
        $('.alert-danger').hide();
        $('.login').hide();
        $('.loginNav').hide();
        $('.signupNav').hide();
        $('.logoutNav').show();
    }
    $('#loginForm').submit(function(event){
        event.preventDefault();
        $.post('authentication.php',$(this).serialize()).done(function(res){
            if( res == "wrong account"){
                console.log(res);
            }
            else{
                id = parseInt(res);
                console.log("sucess login!"+id)
                loginPanel();
            }
        });
    })
    var logoutPanel = function(){
        $('.logout').hide();
        $('.loginNav').show();
        $('.signupNav').show();
        $('.logoutNav').hide();
    }
    $('#logoutForm').submit(function(){
        $.post('authentication.php',{logout:true,id:id}).done(function(res){
            console.log(res);
            logoutPanel();
            resetPanel();
            $('.next').hide();
            $('.answer').hide();
        })
    })
    
}//main

$(document).ready(main);