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
            $currentTime = date("Y/m/d h:i:sa");
            
            $sql = "INSERT INTO awaitingQuestions (question, question_category, answers, correct_answer, added_by, add_date, added_from) VALUES (".$data['question'].", 2, 3, 4, 5, 6, 7)";
            // $data['categoryList'].",".
            // json_encode($data['answers']).",".
            // $data['correctAnswer'].",".
            // $data['addedBy'].",".
            // $currentTime.",".
            // $data['addedFrom'].")";
                
            connectSQLite($sql, $database);
        }
    }
?>