<?php
    require('scripts.php');
    
    header("Content-type: application/json; charset=UTF-8");
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE"); 
    header("Access-Control-Allow-Headers: Content-Type");

    $database = 'database.db';
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
            }
        }
        if($url[$i] == 'getCategories') {
            $sql = "SELECT * FROM categories";
            $SQLresult['categories'] = connectSQLite($sql, $database);
            echo json_encode($SQLresult);
            exit();
        }
        // if($url[$i] == 'getResults') {
        //     echo 'results';
        // }
    }
    if($_SERVER['REQUEST_METHOD'] == 'POST') { 
        if($url[$i] == 'postQuestion') {
            $data = json_decode(file_get_contents('php://input'), true);
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
                addNewQuestion($data, $database);
                $result['status'] = "Success";
                $result['message'] = "Your question is added do avaiting list. Will be moderated soon";
                $result['fields'] = $checking;
                http_response_code(201);
                echo json_encode($result);
            } 
        }
    }
?>