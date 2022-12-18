<?php
    require('scripts.php');
    
    header("Content-type: application/json; charset=UTF-8");
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE"); 
    header("Access-Control-Allow-Headers: Content-Type");

    $database = 'database.db';
    $url = URLarray();
    $i = 3;

    if($_SERVER['REQUEST_METHOD'] == 'GET') { // pobiera pytanie lub pobiera wyniki
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
    // if($_SERVER['REQUEST_METHOD'] == 'POST') { // dodaje pytanie lub dodaje wynik
    //     echo 'post';
    // }
?>