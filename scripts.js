// QuizApp v. v. 1.017
// By Michal Futera
// https://linktr.ee/mjfutera

const APIurl = "https://api.michalfutera.pro/QuizApp/database";
const SQLregex = /\b(ALTER|CREATE|DELETE|DROP( +TABLE){0,1}|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/;

const getData = async (url) => await fetch(url).then(r => r.json());

const memoryCheck = () => {
    if (!sessionStorage.currentResult) {
        sessionStorage.setItem("currentResult", 0);
    }
    if (!localStorage.bestResult) {
        localStorage.setItem("bestResult", 0);
    }
    if (!document.cookie || document.cookie === '') {
        document.cookie = '{"bestResult" : 0}';
    }

}

const result = points => {
    memoryCheck();
    sessionStorage.currentResult = Number(sessionStorage.currentResult) + points;
    const result = JSON.parse(document.cookie);
    if(Number(sessionStorage.currentResult) >= Number(result.bestResult)) {
        result.bestResult = Number(sessionStorage.currentResult);
    }
    document.cookie = JSON.stringify(result);
    document.getElementById("currentResult").innerText = sessionStorage.currentResult;
    document.getElementById("bestResult").innerText = result.bestResult;
}

const showQuestion = async () => {
    memoryCheck();
    document.getElementById("currentResult").innerText = sessionStorage.currentResult;
    const result = JSON.parse(document.cookie);
    document.getElementById("bestResult").innerText = result.bestResult;
    const data = await getData(`${APIurl}/getQuestion`);
    document.getElementById("question").innerText = data['question'];
    document.getElementById("questionCategory").innerText = "Category: "+data['category'];
    document.getElementById("answers").innerHTML = '';
    const answersArray = [];
    for (const [key, value] of Object.entries(data['answers'])) {
        answersArray.push(`            
        <div class="answer" id="${key}" onclick="checkAllAnswers('${key}', '${data['correct']}', '${Object.keys(data['answers'])}')">
            <h2 id="text-${key}">${value}</h2>
        </div>`);
    }
    document.getElementById("answers").innerHTML = answersArray.sort((a, b) => 0.5 - Math.random()).join('');
}

const checkOneAnswer = (chosen, correct, id) => {
    if (chosen === correct) {
        if (chosen == id) {
            document.getElementById(id).className = "correctAnswer";
            document.getElementById(id).removeAttribute("onclick");
        } else {
            document.getElementById(id).className = "notUsedAnswer";
            document.getElementById(id).removeAttribute("onclick");
        }
    } else {
        if (id === correct) {
            document.getElementById(id).className = "correctAnswer";
            document.getElementById(id).removeAttribute("onclick");
        } else if (id === chosen) {
            document.getElementById(id).className = "incorrectAnswer"; 
            document.getElementById(id).removeAttribute("onclick");
        } else {
            document.getElementById(id).className = "notUsedAnswer";
            document.getElementById(id).removeAttribute("onclick");
        }
    }
}

const checkAllAnswers = (chosen, correct, all) => {
    if (chosen === correct) {
        result(1)
    } else {
        result(-1);
    }
    all.split(",").forEach(r => checkOneAnswer(chosen, correct, r));
}

const showCategories = async () => {
    document.getElementById("categoryList").innerText = '';
    const data = await getData(`${APIurl}/getCategories`);
    const categories = data['categories'].map(e => `
        <option value="${e.category_id}">${e.category}</option>
    `)
    document.getElementById("categoryList").innerHTML = categories.join('');
}

const addAnswers = () => {
    const answers = document.getElementById("answersList").value;
    document.getElementById("answersFields").innerHTML = "";
    document.getElementById("correctAnswerList").innerHTML = "";
    const answersField = [];
    const correctAnswer = [];
    for (let i = 1; i<=answers; i++) {
        answersField.push(`
        <div class="formFields formBackground">
            <div class="formFieldDesc">
                <b>Answer #${i}</b>
            </div>
            <div class="formField">
                <textarea id="answer-${i}" maxlength="140" minlength="5" required oninput="length('answer-${i}', 'answerMax-${i}'); inputChceckAnswer('answer-${i}', 'answerError-${i}')"></textarea>
                <div id="answerError-${i}"></div>
                <div>Used <span id="answerMax-${i}">0</span> of minimum 1 and maximum 140 characters.</div>
            </div>
        </div>
        `);
        correctAnswer.push(`
            <option value="${i}">Answer #${i}</option>
        `);
    }
    document.getElementById("answersFields").innerHTML = answersField.join("");
    document.getElementById("correctAnswerList").innerHTML = correctAnswer.join("");
}

const length = (fieldID, replyID) => {
    const length = document.getElementById(fieldID).value.length;
    document.getElementById(replyID).innerHTML = length;
}

const inputCheckQuestion = () => {
    const value = document.getElementById("questionArea").value;
    const errorArray =[];
    if (value.length < 10) {
        errorArray.push(' --> Text is to short');
        document.getElementById("questionError").classList.add("addFieldIncorrect");
    } else if (value.length >= 10 && value.length < 250) {
        document.getElementById("questionError").classList.remove("addFieldCorrect")
    } else if (value.length >= 251) {
        errorArray.push(' --> Not many characters left');
        document.getElementById("questionError").classList.add("addFieldIncorrect");
    }
    if (SQLregex.test(value)){
        errorArray.push(' --> No SQL Injection, please');
        document.getElementById("questionError").classList.add("addFieldIncorrect");
    }
    document.getElementById("questionError").innerHTML = errorArray.join("");
}

const inputChceckAnswer = (fieldID, replyID) => {
    const value = document.getElementById(fieldID).value;
    const errorArray =[];
    if (value.length < 1) {
        errorArray.push(' --> Text is to short');
        document.getElementById(replyID).classList.add("addFieldIncorrect");
    } else if (value.length >= 1 && value.length < 120) {
        document.getElementById(replyID).classList.remove("addFieldCorrect")
    } else if (value.length >= 121) {
        errorArray.push(' --> Not many characters left');
        document.getElementById(replyID).classList.add("addFieldIncorrect");
    }
    if (SQLregex.test(value)){
        errorArray.push(' --> No SQL Injection, please');
        document.getElementById(replyID).classList.add("addFieldIncorrect");
    }
    document.getElementById(replyID).innerHTML = errorArray.join("");
}

const inputChceckName = () => {
    const value = document.getElementById("addedBy").value;
    if (SQLregex.test(value)){
        document.getElementById("addedByError").innerHTML = " --> No SQL Injection, please";
        document.getElementById("addedByError").classList.add("addFieldIncorrect");
    } else {
        document.getElementById("addedByError").innerHTML = "";
        document.getElementById("addedByError").classList.remove("addFieldIncorrect");
    }
}

const finalCheckName = () => SQLregex.test(document.getElementById("addedBy").value);

const finalChceckText = (string, min, max)=> string.length >= min && string.length <= max && !SQLregex.test(string);

const addQuestion = async () => {
    const question = {};
    question['categoryList'] = Number(document.getElementById("categoryList").value);
    question['question'] = document.getElementById("questionArea").value;
    const amountOfAnswers = document.getElementById("answersList").value;
    question['answers']={};
    for (let i = 1; i<= amountOfAnswers; i++) {
        question['answers'][i] = document.getElementById(`answer-${i}`).value;
    }
    question['correctAnswer'] = Number(document.getElementById("correctAnswerList").value);
    question['addedBy'] = document.getElementById("addedBy").value;
    question['addedFrom'] = document.getElementById("addedFrom").value;
    const chechedQuestion = finalChceckText(question['question'], 10, 280);
    const checkecAnswers = Object.values(question['answers']).some(e => finalChceckText(e, 1, 140));
    const checkedName = finalChceckText(question['addedBy'], 1, 100);
    if (chechedQuestion && checkecAnswers && checkedName) {
        const options = {
            method: 'POST', 
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: 'same-origin', 
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify(question) 
          };
        const result = await fetch(`${APIurl}/postQuestion`, options).then(r => r.json());
        console.log(result['status']);
        alert(result['message']);
    }
}

const showResults = async () => {
    const results = await getData(`${APIurl}/getResults`);
    const newResults = results['results'].map(e => `
        <li>${e.name} - ${e.result} points gained on ${e.result_time}</li>
    `);
    document.getElementById("bestResults").innerHTML = "Best results:"+newResults.join("");
}

const postResult = async () => {
    const result = {};
    result['result'] = Number(sessionStorage.currentResult);
    result['name'] = prompt('What is Your name?');
    if(result['result'].length===0 || result['result'] === null) {result['result'] = 'Unknown'};
    if(finalChceckText(result['name'], 1, 20)) {
        const options = {
            method: 'POST', 
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: 'same-origin', 
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify(result) 
          };
        const answer = await fetch(`${APIurl}/postResult`, options).then(r => r.json());
        console.log(answer['status']);
        alert(answer['message']);
        showResults();
    }
}
