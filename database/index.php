<?php
    // QuizApp v. 1.021
    // By Michal Futera
    // https://linktr.ee/mjfutera

    require('scripts.php');
    require('pass.php');
    
    header("Content-type: application/json; charset=UTF-8");
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE"); 
    header("Access-Control-Allow-Headers: Content-Type");

    $database = 'database.db';
    $currentTime = date("Y/m/d h:i:sa");
    $url = URLarray();
    $i = 3;

    if($_SERVER['REQUEST_METHOD'] == 'GET') { 
        if($url[$i] == 'getQuestion') {
            if(isset($_GET['category'])) {
                $sql = "SELECT 
                questions.question AS question, 
                questions.answers AS answers, 
                questions.correct_answer AS correct, 
                categories.category AS category
                FROM questions, categories 
                WHERE categories.category_id=questions.question_category 
                AND categories.category_id=".$_GET['category']."
                ORDER BY RANDOM () LIMIT 1";
                $SQLresult = connectSQLite($sql, $database)[0];
                $result['question'] = $SQLresult['question'];
                $result['answers'] = json_decode($SQLresult['answers']);
                $result['correct'] = $SQLresult['correct'];
                $result['category'] = $SQLresult['category'];
                echo json_encode($result);
                exit();

            } else {
                $sql = "SELECT 
                questions.question AS question, 
                questions.answers AS answers, 
                questions.correct_answer AS correct, 
                categories.category AS category
                FROM questions, categories 
                WHERE categories.category_id=questions.question_category 
                ORDER BY RANDOM () LIMIT 1";
                $SQLresult = connectSQLite($sql, $database)[0];
                $result['question'] = $SQLresult['question'];
                $result['answers'] = json_decode($SQLresult['answers']);
                $result['correct'] = $SQLresult['correct'];
                $result['category'] = $SQLresult['category'];
                echo json_encode($result);
                exit();
            }}
        if($url[$i] == 'getCategories') {
            $sql = "SELECT * FROM categories";
            $SQLresult['categories'] = connectSQLite($sql, $database);
            echo json_encode($SQLresult);
            exit();}
        if($url[$i] == 'getResults') {
            $sql = "SELECT name, result, result_time FROM results ORDER BY result DESC LIMIT 10";
            $result['results'] = connectSQLite($sql, $database);
            echo json_encode($result);}
        if($url[$i] == 'checkPassword') {
            if(getallheaders()['Password'] == $adminPassword) {
                echo json_encode('true');
            } else {
                echo json_encode('false');
            }}// checks password for admin panel
        // if($url[$i] == 'getAwaitingQuestion') {} // gets awaiting questions from DB to be approved/ modified or deleted by admin. Require Admin Password
        // if($url[$i] == 'getAwaitingCategory') {} // gets awaiting categories from DB to be approved/ modified or deleted by admin. Require Admin Password
        // if($url[$i] == 'getStats') {} // shows statistics for categories
    }
    if($_SERVER['REQUEST_METHOD'] == 'POST') { 
        $data = json_decode(file_get_contents('php://input'), true);
        if($url[$i] == 'postQuestion') {
            $checking['categoryCheck'] = fullCategoryCheck($data, $database);
            $checking['questionCheck'] = questionCheck($data);
            $checking['answerCheck'] = answerObjectCheck($data);
            $checking['correctAnswerCheck'] = correctAnswerCheck($data);
            $checking['addedFromCheck'] = addedFromAndByCheck($data, 'addedFrom');
            $checking['addedByCheck'] = addedFromAndByCheck($data, 'addedBy');

            if(in_array(false, $checking)) { 
                $result['status'] = "Failure";
                $result['message'] = "One or more fields are incorrect";
                $result['fields'] = $checking;
                echo json_encode($result);
            } else {
                addNewQuestion($data, $database, $currentTime);
                $result['status'] = "Success";
                $result['message'] = "Your question is added to avaiting list. Will be moderated soon";
                $result['fields'] = $checking;
                http_response_code(201);
                echo json_encode($result);
            }}
            if($url[$i] == 'postResult') {
            $name = $data['name'];
            $result = $data['result'];
            $checking['resultCheck'] = !SQLincection($result);
            $checking['nameCheck'] = !SQLincection($name) && gettype($data['name'] == 'string') && strlen($data['name'])>0;
            if ($checking['nameCheck'] && $checking['resultCheck']) {
                $sql = "
                INSERT INTO results (
                    name,
                    result,
                    result_time
                ) VALUES (
                    '$name',
                    '$result',
                    '$currentTime'
                )";
                connectSQLite($sql, $database);
                $finalResult['status'] = "Success";
                $finalResult['message'] = "Your score is submited";
                $finalResult['fields'] = $checking;
                http_response_code(201);
                echo json_encode($finalResult);
            } else {
                $finalResult['status'] = "Failure";
                $finalResult['message'] = "One or more fields are incorrect";
                $finalResult['fields'] = $checking;
                echo json_encode($finalResult);
            }}
            // if($url[$i] == 'postNewQuestion') {} // adds question to database, after approvement by admin. Require Admin Password
        // if($url[$i] == 'postNewCategory') {} // adds category to database, after approvement by admin. Require Admin Password
    }
    // if($_SERVER['REQUEST_METHOD'] == 'PUT') {
    //     if($url[$i] == 'editQuestion') {} // edit question in database. Require Admin Password
    //     if($url[$i] == 'editCategory') {} // edit category in database. Require Admin Password
    //     if($url[$i] == 'editAwaitingQuestion') {} // edit question in database. Require Admin Password
    //     if($url[$i] == 'editAwaitingCategory') {} // edit category in database. Require Admin Password
    // } 
    // if($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    //     if($url[$i] == 'deleteQuestion') {} // delete question in database. Require Admin Password
    //     if($url[$i] == 'deleteAwaitingQuestion') {} // delete awaiting question in database. Require Admin Password
    //     if($url[$i] == 'deleteCategory') {} // delete category in database. Require Admin Password
    //     if($url[$i] == 'deleteResult') {} // delete awaiting category in database. Require Admin Password
    // 
?>