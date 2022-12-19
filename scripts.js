const getData = async (url) => await fetch(url).then(r => r.json());

const memoryCheck = () => {
    if (!sessionStorage.currentResult) {
        sessionStorage.setItem("currentResult", 0);
    }
    if (!localStorage.bestResult) {
        localStorage.setItem("bestResult", 0);
    }
}

const result = points => {
    memoryCheck();
    sessionStorage.currentResult = Number(sessionStorage.currentResult) + points;
    if(Number(sessionStorage.currentResult) >= Number(localStorage.bestResult)) {
        localStorage.bestResult = sessionStorage.currentResult;
    }
    document.getElementById("currentResult").innerText = sessionStorage.currentResult;
    document.getElementById("bestResult").innerText = localStorage.bestResult;
    // console.clear();
    // console.log("Current result is "+sessionStorage.currentResult);
    // console.log("Best result is "+localStorage.bestResult);
}

const showQuestion = async () => {
    memoryCheck();
    document.getElementById("currentResult").innerText = sessionStorage.currentResult;
    document.getElementById("bestResult").innerText = localStorage.bestResult;
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