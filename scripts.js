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
    if(Number(sessionStorage.currentResult) >= Number(localStorage.bestResult)) {
        localStorage.bestResult = sessionStorage.currentResult;
    }
    if(Number(sessionStorage.currentResult) >= Number(result.bestResult)) {
        result.bestResult = Number(sessionStorage.currentResult);
    }
    console.log(result);
    document.cookie = JSON.stringify(result);
    document.getElementById("currentResult").innerText = sessionStorage.currentResult;
    document.getElementById("bestResult").innerText = result.bestResult;
}

const showQuestion = async () => {
    memoryCheck();
    document.getElementById("currentResult").innerText = sessionStorage.currentResult;
    const result = JSON.parse(document.cookie);
    document.getElementById("bestResult").innerText = result.bestResult;
    const data = await getData('https://api.michalfutera.pro/QuizApp/database/getQuestion');
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

showQuestion();
document.getElementById("getQuestion").addEventListener("click", showQuestion);