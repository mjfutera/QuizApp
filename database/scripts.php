<?php
    function URLarray ($url = NULL) {
        if ($url===NULL) {$url = $_SERVER['REQUEST_URI']; }
        return explode("/", parse_url($url, PHP_URL_PATH));
    }

    function connectSQLite($sql, $file) {
        $pdo = new PDO('sqlite:'.$file);
        $statement = $pdo->query($sql);
        $rows = $statement -> fetchAll(PDO::FETCH_ASSOC);
        return $rows;
    }

    function addNewQuestion ($object, $database, $currentTime) {
        $currentTime = date("Y/m/d h:i:sa");
        $question = $object['question'];
        $categoryList = $object['categoryList'];
        $answers = json_encode($object['answers']);
        $correctAnswer = $object['correctAnswer'];
        $addedBy = $object['addedBy'];
        $addedFrom = $object['addedFrom'];
            
        $sql = "INSERT INTO awaitingQuestions (
            question, 
            question_category, 
            answers, 
            correct_answer, 
            added_by, 
            add_date, 
            added_from
        ) VALUES (
            '$question', 
            $categoryList, 
            '$answers', 
            $correctAnswer, 
            '$addedBy', 
            '$currentTime', 
            '$addedFrom'
        )";                
            connectSQLite($sql, $database);
    }

    function SQLincection ($string) {
        $regex = "/\b(ALTER|CREATE|DELETE|DROP( +TABLE){0,1}|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/";
        return preg_match($regex, $string);
    }

    function categoryCount ($category_id, $database) {
        $sql = "SELECT count(category_id) AS count FROM categories WHERE category_id=".$category_id;
        $result = connectSQLite($sql, $database);
        return ($result[0]['count'] == 1);
    }

    function categoryGet ($category_id, $database) {
        $sql = "SELECT category FROM categories WHERE category_id=".$category_id;
        $result = connectSQLite($sql, $database);
        return $result[0]['category'];
    }

    function categoryCheck ($object) {
        return isset($object['categoryList']) 
        && $object['categoryList'] !== NULL 
        && gettype($object['categoryList']) == "integer" 
        && !SQLincection($object['categoryList']);
    }

    function fullCategoryCheck ($object, $database) {
        if(categoryCheck($object)) {
            return categoryCount($object['categoryList'], $database);
        };
    }

    function questionCheck ($object) {
        return isset($object) 
        && $object['question'] !== NULL 
        && gettype($object['question']) == "string" 
        && strlen($object['question']) >= 10
        && strlen($object['question']) <= 280 
        && !SQLincection($object['question']);
    }

    function answerObjectCheck ($object) {
        $regex = "/\b(ALTER|CREATE|DELETE|DROP( +TABLE){0,1}|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/";
        return isset($object['answers']) 
        && count($object['answers']) >= 2 
        && count($object['answers']) <= 6 
        && gettype($object['answers']) == "array" 
        && !SQLincection(json_encode($object['answers']))
        && !in_array($regex, $object['answers']);
    }

    function correctAnswerCheck ($object) {
        return isset($object['correctAnswer']) 
        && $object['correctAnswer'] !== NULL 
        && gettype($object['correctAnswer']) == "integer" 
        && strlen($object['correctAnswer']) >= 1 
        && $object['correctAnswer'] <= count($object['answers']) 
        && !SQLincection($object['correctAnswer'])
        && in_array($object['correctAnswer'], array_keys($object['answers']));
    }

    function addedFromAndByCheck ($object, $arr) {
        return isset($object[$arr]) 
        && $object[$arr] !== NULL 
        && gettype($object[$arr]) == "string" 
        && strlen($object[$arr]) >= 3 
        && strlen($object[$arr]) <= 20 
        && !SQLincection($object[$arr]);
    }

    // function resultCheck ($object) {

    // }
?>