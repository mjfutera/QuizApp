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

    function SQLincection ($string) {
        $regex = "/\b(ALTER|CREATE|DELETE|DROP( +TABLE){0,1}|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/";
        return preg_match($regex, $string);
    }

    function categoryCount ($category_id, $database) {
        $sql = "SELECT count(category_id) AS count, category FROM categories WHERE category_id=".$category_id;
        $result = connectSQLite($sql, $database);
        if ($result[0]['count'] == 1) {
            return $result[0]['category'];
        } else {
            return $result[0]['count'];
        };
    }

    function categoryCheck ($object, $database) {
        $check = isset($object['categoryList']) 
        && $object['categoryList'] !== NULL 
        && gettype($object['categoryList']) == "integer" 
        && !SQLincection($object['categoryList']);
        if(!$check) {
            return false;
        } else {
            return categoryCount($object['categoryList'], $database);
        }
    }

    function textCheck ($object, $min, $max) {
        return isset($object) 
        && $object !== NULL 
        && gettype($object) == "string" 
        && strlen($object) >= $min
        && strlen($object) <= $max 
        && !SQLincection($object);
    }

    // function singleAnswerCheck ($object) {
    //     $count = count($object['answers']);

    //     foreach($object['answers'] as $key => $val) {
    //         echo $key.$val;
    //         // $object['answers'][$key] = echo $val;
    //         // textCheck($val, 10, 140);
    //     }
    // }

    function answerObjectCheck ($data) {
        return isset($object['answers']) 
        && count($object['answers']) >= 2 
        && count($object['answers']) <= 6 
        && gettype($object['answers']) == "array" 
        && !SQLincection(json_encode($object['answers']));
    }

    function correctAnswerCheck ($object) {
        return isset($object['correctAnswer']) 
        && $object['correctAnswer'] !== NULL 
        && gettype($object['correctAnswer']) == "integer" 
        && strlen($object['correctAnswer']) >= 0 
        && $object['correctAnswer'] <= count($object['answers']) 
        && !SQLincection($object['correctAnswer'])
        && in_array($object['correctAnswer'], array_keys($object['answers']));
    }

    function addedFromAndByCheck ($object, $arr) {
        $pattern = "/\s/";
        return isset($object[$arr]) 
        && $object[$arr] !== NULL 
        && gettype($object[$arr]) == "string" 
        && strlen($object[$arr]) >= 3 
        && strlen($object[$arr]) <= 20 
        && !preg_match($pattern, $object[$arr]) 
        && !SQLincection($object[$arr]);
    }
?>