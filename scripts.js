const getData = async (url) => await fetch(url).then(r => r.json());

const answers = object => {
    document.getElementById("answers").innerHTML = '';
    let answers = '';
    for (const [key, value] of Object.entries(object)) {
        answers = answers + `            
        <div class="answer" id="${key}">
            <h2>${value}</h2>
        </div>`;
    document.getElementById("answers").innerHTML = answers;
    }
}

const showQuestion = async () => {
    const data = await getData('https://api.michalfutera.pro/QuizApp/database/getQuestion');
    console.log(data);
    document.getElementById("question").innerText = data['question'];
    document.getElementById("questionCategory").innerText = "Category: "+data['category'];
    answers(data['answers']);
}



showQuestion();
document.getElementById("getQuestion").addEventListener("click", showQuestion);