// GetEase TrackingAPI
// By Michal Futera
// v. 1.001
// https://linktr.ee/mjfutera?utm_source=GetEase.com

// const apiURL = 'http://localhost/getEase/geolocation/api/';
const apiURL = 'https://api.michalfutera.pro/QuizApp/database';

const getData = async (url) => await fetch(url).then(r => r.json());
describe('Gets question', () => {
    let data;
    beforeAll(async () => {
        data = await getData(`${apiURL}/getQuestion`);
    });
    test('Data is not empty', () => {
        expect(data).not.toBeNull();
    })
    test('Question is not empty', () => {
        expect(data.question).not.toBeNull();
    })
    test('Answers are not empty', () => {
        expect(data.answers).not.toBeNull();
        expect(Object.keys(data.answers).length).toBeGreaterThan(2);
        expect(Object.keys(data.answers).length).not.toBeGreaterThan(6);
    })
    test('Correct answer is not empty and with correct format', () => {
        expect(data.correct).not.toBeNull();
        expect(typeof parseInt(data.correct)).toBe('number');
    })
    test('Category is not empty and with correct format', async () => {
        expect(data.category).not.toBeNull();
        expect(typeof parseInt(data.category)).toBe('number');
    })
})

test('Gets category list', async () => {
    data = await getData(`${apiURL}/getCategories`);
    expect(data).not.toBeNull();
    expect(data.categories.length).toBeGreaterThan(0);
    if(data.categories.length>0){
        data.categories.forEach(element => {
            expect(element.hasOwnProperty('category_id')).toBe(true);
            expect(element.hasOwnProperty('category')).toBe(true);
        });
    }
})

test('Gets results', async () => {
    data = await getData(`${apiURL}/getResults`);
    expect(data).not.toBeNull();
    expect(data.results.length).toBeGreaterThan(0);
    if(data.results.length>0){
        data.results.forEach(element => {
            expect(element.hasOwnProperty('name')).toBe(true);
            expect(element.hasOwnProperty('result')).toBe(true);
            expect(typeof parseInt(element.result)).toBe('number');
            expect(element.hasOwnProperty('result_time')).toBe(true);
        });
    }
})

// describe('GET', () => {
//     describe('Endpoint getExpertPosition', () => {
//         describe('Invalid authorisation', () => {
//             let data;
//             beforeAll(async () => {
//                 data = await getData(`${apiURL}${incorrectOrderNumber}/getExpertPosition`);
//             });
//             test('Provides 404 and correct info when order is not in database', () => {
//                 expect(data.error.code).toBe(404);
//             });
//         })
//         describe('Get Expert Location with correct order number', () => {
//             let data;
//             beforeAll(async () => {
//                 data = await getData(`${apiURL}${orderNumber}/getExpertPosition`);
//             });
//             test('Gets the object', () => {
//                 expect(typeof data).toBe('object', 'Data should be of type object');
//             });
//             test('EXPERT is shown', () => {
//                 expect('expert' in data).toBeTruthy();
//             });
//             test('Data lengh is 1', () => {
//                 expect(Object.keys(data).length).toBe(1, 'Incorrect expert key name');
//             });
//             test('EXPERT lenght is 2', () => {
//                 expect(Object.keys(data.expert).length).toBe(2, 'Incorrect lenght');
//             });
//             test('EXPERT position is shown', () => {
//                 expect('position' in data.expert).toBeTruthy();
//             });
//             test('EXPERT position have 2 coordinates', () => {
//                 expect(Object.keys(data.expert.position).length).toBe(2, 'Incorrect expert key name');
//             });
//             test('Expert position values are numbers', () => {
//                 expect(Object.values(data.expert.position).every(value => typeof value === 'number')).toBeTruthy();
//             });
//             test('Log time is shown', () => {
//                 expect('logTime' in data.expert).toBeTruthy();
//             });
//             test('Log time is string', () => {
//                 expect(typeof data.expert.logTime === 'string').toBeTruthy();
//             });
//         });
//     })
//     describe('Endpoint getClientPosition', () => {
//         let data;
//         beforeAll(async () => {
//             data = await getData(`${apiURL}KNPDQ1160UVM4/getClientPosition`);
//         });
//         test('Positon is an array', () => {
//             console.log(typeof data.client.position);
//             expect(typeof data.client.position).toBe('object');
//         })
//     })
// })

// describe('POST', () => {
//     const getDataWithOptions = async (url, options) => await fetch(url, options).then(r => r.json());
//     let options = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };
//     describe('Endpoint postExpertPosition', () => {
//         describe('Invalid authorisation', () => {
//             test('Provides 404 and correct info when order is not in database', async () => {
//                 const request = {
//                     "latitude": 52.3873977,
//                     "longitude": 4.66234,
//                     "timestamp": 65448646
//                     };
//                     options.body = JSON.stringify(request);
//                     const data = await getDataWithOptions(`${apiURL}${incorrectOrderNumber}/postExpertPosition?key=${orderKey}`, options);
//                     expect(data.error.code).toBe(404);
//             });
//             test('Provides 404 and correct info when Key is incorrect', async () => {
//                 const request = {
//                     "latitude": 52.3873977,
//                     "longitude": 4.66234,
//                     "timestamp": 65448646
//                     };
//                     options.body = JSON.stringify(request);
//                     const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${invalidOrderKey}`, options);
//                     expect(data.error.code).toBe(403);
//             });
        
//         });
//         describe('Post Expert Location', () => {
//             test('Sends correct data and saves in database with no comments', async () => {
//               const request = {
//                 "latitude": 52.3873977,
//                 "longitude": 4.66234,
//                 "timestamp": 65448646
//               };
//               options.body = JSON.stringify(request);
//               const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
//               expect(data.expertLocation.code).toBe(201);
//             });
//             test('Sends correct data and saves in database with comments', async () => {
//                 const request = {
//                   "latitude": 52.3873977,
//                   "longitude": 4.66234,
//                   "timestamp": 65448646,
//                   "comment": "API Tests"
//                 };
//                 options.body = JSON.stringify(request);
//                 const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
//                 expect(data.expertLocation.code).toBe(201);
//             });
//         })
//         describe('Errors with latitude', () => {
//             test('No latitude provided - error 400 bad request', async () => {
//                 const request = {
//                     "longitude": 4.66234,
//                     "timestamp": 65448646
//                 };
//                 options.body = JSON.stringify(request);
//                 const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
//                 expect(data.error.code).toBe(400);
//             });
//             test('Latitude provided as string - error 400 bad request', async () => {
//                 const request = {
//                     "latitude": "52.3873977",
//                     "longitude": 4.66234,
//                     "timestamp": 65448646
//                 };
//                 options.body = JSON.stringify(request);
//                 const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
//                 expect(data.error.code).toBe(400);
//             });
//             test('Latitude as SQL Injection - error 400 bad request', async () => {
//                 const request = {
//                     "latitude": "DROP TABLE",
//                     "longitude": 4.66234,
//                     "timestamp": 65448646
//                 };
//                 options.body = JSON.stringify(request);
//                 const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
//                 expect(data.error.code).toBe(400);
//             });
//         })
//         describe('Errors with longitude', () => {
//             test('No longitude provided - error 400 bad request', async () => {
//                 const request = {
//                     "latitude": 52.3873977,
//                     "timestamp": 65448646
//                 };
//                 options.body = JSON.stringify(request);
//                 const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
//                 expect(data.error.code).toBe(400);
//             });
//             test('Longitude provided as string - error 400 bad request', async () => {
//                 const request = {
//                     "latitude": 52.3873977,
//                     "longitude": "4.66234",
//                     "timestamp": 65448646
//                 };
//                 options.body = JSON.stringify(request);
//                 const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
//                 expect(data.error.code).toBe(400);
//             });
//             test('Longitude as SQL Injection - error 400 bad request', async () => {
//                 const request = {
//                     "latitude": 52.3873977,
//                     "longitude": "DROP Table",
//                     "timestamp": 65448646
//                 };
//                 options.body = JSON.stringify(request);
//                 const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
//                 expect(data.error.code).toBe(400);
//             });
//         })
//         describe('Errors with timestamp', () => {
//             test('No timestamp provided - error 400 bad request', async () => {
//                 const request = {
//                     "latitude": 52.3873977,
//                     "longitude": 4.66234
//                 };
//                 options.body = JSON.stringify(request);
//                 const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
//                 expect(data.error.code).toBe(400);
//             });
//             test('Timestamp provided as string - error 400 bad request', async () => {
//                 const request = {
//                     "latitude": 52.3873977,
//                     "longitude": 4.66234,
//                     "timestamp": "65448646"
//                 };
//                 options.body = JSON.stringify(request);
//                 const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
//                 expect(data.error.code).toBe(400);
//             });
//             test('Timestamp as SQL Injection - error 400 bad request', async () => {
//                 const request = {
//                     "latitude": 52.3873977,
//                     "longitude": 4.66234,
//                     "timestamp": "DROP TABLE"
//                 };
//                 options.body = JSON.stringify(request);
//                 const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
//                 expect(data.error.code).toBe(400);
//             });
//         })
//     })
//     describe('Enpoint addNewOrder', () => {
//         describe('Authorised login', () => {
//             options = {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                   "Authorization": "Basic " + btoa(authLogin+":"+authPassword)
//                 }
//             }
//             describe('Postcode check', ()=>{
//                 test('Postcode not a string - code 404 bad request and correct message', async ()=>{
//                     const request = {
//                         "customerPostCode": 2021,
//                         "orderCategory": "Get Clean"
//                     };
//                         options.body = JSON.stringify(request);
//                         const data = await getDataWithOptions(`${apiURL}${newOrderNumber}/addNewOrder`, options);
//                         expect(data.error.code).toBe(400);
//                         expect(data.error.message).toBe('invalid data type. wrong format customerPostCode');
//                 })
//                 test('Postcode in wrong format - code 400 bad request and correct message', async ()=>{
//                     const request = {
//                         "customerPostCode": "1326GSD",
//                         "orderCategory": "Get Clean"
//                     };
//                         options.body = JSON.stringify(request);
//                         const data = await getDataWithOptions(`${apiURL}${newOrderNumber}/addNewOrder`, options);
//                         expect(data.error.code).toBe(400);
//                         expect(data.error.message).toBe('invalid data type. wrong format customerPostCode');
//                 })
//             })
//             describe('Order category check', () => {
//                 test('Category not a string - code 400 bad request and correct message', async ()=>{
//                     const request = {
//                         "customerPostCode": "2021EB",
//                         "orderCategory": 213
//                     };
//                         options.body = JSON.stringify(request);
//                         const data = await getDataWithOptions(`${apiURL}${newOrderNumber}/addNewOrder`, options);
//                         expect(data.error.code).toBe(400);
//                         expect(data.error.message).toBe('invalid data type. wrong format orderCategory');
//                 })
//                 test('Category as SQL injection', async ()=>{
//                     const request = {
//                         "customerPostCode": "2021EB",
//                         "orderCategory": "DROP TABLE"
//                     };
//                         options.body = JSON.stringify(request);
//                         const data = await getDataWithOptions(`${apiURL}${newOrderNumber}/addNewOrder`, options);
//                         expect(data.error.code).toBe(400);
//                         expect(data.error.message).toBe('invalid data type. wrong format orderCategory');
//                 })
//             })
//             test('Adds new order to database', async ()=>{
//                 const request = {
//                     "customerPostCode": "2021EB",
//                     "orderCategory": "Get Clean"
//                 };
//                     options.body = JSON.stringify(request);
//                     const data = await getDataWithOptions(`${apiURL}${newOrderNumber}/addNewOrder`, options);
//                     expect(data.orderDataBase.code).toBe(201);
//                     expect(data.orderDataBase.message).toBe('added to database');
//             })
//         })
//         test('No authorisation', async () => {
//             options = {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                   "Authorization": "Basic " + btoa(incorrectAuthLogin+":"+incorrectAuthPassword)
//                 }
//             }
//             const request = {
//                 "customerPostCode": "2021EB",
//                 "orderCategory": "Get Clean"
//             };
//             options.body = JSON.stringify(request);
//             const data = await getDataWithOptions(`${apiURL}${newOrderNumber}/addNewOrder`, options);
//             expect(data.error.code).toBe(401);
//             expect(data.error.message).toBe('401 Unauthorized');
//         });
//     })
// });

