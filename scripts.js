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

const showCategories = async () => {
    document.getElementById("categoryList").innerText = '';
    const data = await getData('https://api.michalfutera.pro/QuizApp/database/getCategories');
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
        <div class="formFields">
            <div class="formFieldDesc">
                <b>Answer #${i}</b>
            </div>
            <div class="formField">
                <textarea id="answer-${i}"></textarea>
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