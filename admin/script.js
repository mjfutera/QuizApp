document.getElementById('login').addEventListener("click", async () => {
    const url = 'https://api.michalfutera.pro/QuizApp/database/checkPassword';
    const pass = document.getElementById('password').value;
          const options = {
              method: 'GET', 
              mode: 'cors', 
              cache: 'no-cache', 
              credentials: 'same-origin', 
              headers: {
                'Content-Type': 'application/json',
                'password': pass
              },
              redirect: 'follow', 
              referrerPolicy: 'no-referrer', 
              body: null
            };
    const result = await fetch(url, options).then(r => r.json());
    console.log(result);
    document.getElementById('info').innerText = result;
  });