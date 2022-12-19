const getData = async (url) => await fetch(url).then(r => r.json());

const showQuestion = async () => {
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
    document.getElementById("answers").innerHTML = answersArray.join('');
}

const checkOneAnswer = (chosen, correct, id) => {
    if (chosen === correct) {
        if (chosen == id) {
            document.getElementById(id).className = "correctAnswer";
        } else {
            document.getElementById(id).className = "notUsedAnswer";
        }
    } else { // incorrect answer
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
    all.split(",").forEach(r => checkOneAnswer(chosen, correct, r));
}

showQuestion();
document.getElementById("getQuestion").addEventListener("click", showQuestion);