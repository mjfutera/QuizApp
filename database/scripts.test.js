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

