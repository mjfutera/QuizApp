// GetEase TrackingAPI
// By Michal Futera
// v. 1.001
// https://linktr.ee/mjfutera?utm_source=GetEase.com

const apiURL = 'http://localhost/getEase/geolocation/api/';
// const apiURL = 'https://important.michalfutera.pro/gease/';
const orderNumber = 'KNPDQ1160QVM4';
const incorrectOrderNumber = 'KNPDQ1160QVM41';
const orderKey = 'e980fe-de36b7-4551fe-d2b6df-dd27d0';
const invalidOrderKey = 'e980fe-de36b7-4551fe-d2b6df-dd27d';

const getData = async (url) => await fetch(url).then(r => r.json());
describe('GET', () => {
    describe('Endpoint getExpertPosition', () => {
        describe('Invalid authorisation', () => {
            let data;
            beforeAll(async () => {
                data = await getData(`${apiURL}${incorrectOrderNumber}/getExpertPosition`);
            });
            test('Provides 404 and correct info when order is not in database', () => {
                expect(data.error.code).toBe(404);
            });
        })
        describe('Get Expert Location with correct order number', () => {
            let data;
            beforeAll(async () => {
                data = await getData(`${apiURL}${orderNumber}/getExpertPosition`);
            });
            test('Gets the object', () => {
                expect(typeof data).toBe('object', 'Data should be of type object');
            });
            test('EXPERT is shown', () => {
                expect('expert' in data).toBeTruthy();
            });
            test('Data lengh is 1', () => {
                expect(Object.keys(data).length).toBe(1, 'Incorrect expert key name');
            });
            test('EXPERT lenght is 2', () => {
                expect(Object.keys(data.expert).length).toBe(2, 'Incorrect lenght');
            });
            test('EXPERT position is shown', () => {
                expect('position' in data.expert).toBeTruthy();
            });
            test('EXPERT position have 2 coordinates', () => {
                expect(Object.keys(data.expert.position).length).toBe(2, 'Incorrect expert key name');
            });
            test('Expert position values are numbers', () => {
                expect(Object.values(data.expert.position).every(value => typeof value === 'number')).toBeTruthy();
            });
            test('Log time is shown', () => {
                expect('logTime' in data.expert).toBeTruthy();
            });
            test('Log time is string', () => {
                expect(typeof data.expert.logTime === 'string').toBeTruthy();
            });
        });
    })
})

describe('POST', () => {
    const getDataWithOptions = async (url, options) => await fetch(url, options).then(r => r.json());
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    describe('Endpoint postExpertPosition', () => {
        describe('Invalid authorisation', () => {
            test('Provides 404 and correct info when order is not in database', async () => {
                const request = {
                    "latitude": 52.3873977,
                    "longitude": 4.66234,
                    "timestamp": 65448646
                    };
                    options.body = JSON.stringify(request);
                    const data = await getDataWithOptions(`${apiURL}${incorrectOrderNumber}/postExpertPosition?key=${orderKey}`, options);
                    expect(data.error.code).toBe(404);
            });
            test('Provides 404 and correct info when Key is incorrect', async () => {
                const request = {
                    "latitude": 52.3873977,
                    "longitude": 4.66234,
                    "timestamp": 65448646
                    };
                    options.body = JSON.stringify(request);
                    const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${invalidOrderKey}`, options);
                    expect(data.error.code).toBe(403);
            });
        
        });
        describe('Post Expert Location', () => {
            test('Sends correct data and saves in database with no comments', async () => {
              const request = {
                "latitude": 52.3873977,
                "longitude": 4.66234,
                "timestamp": 65448646
              };
              options.body = JSON.stringify(request);
              const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
              expect(data.expertLocation.code).toBe(201);
            });
            test('Sends correct data and saves in database with comments', async () => {
                const request = {
                  "latitude": 52.3873977,
                  "longitude": 4.66234,
                  "timestamp": 65448646,
                  "comment": "API Tests"
                };
                options.body = JSON.stringify(request);
                const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
                expect(data.expertLocation.code).toBe(201);
            });
        })
        describe('Errors with latitude', () => {
            test('No latitude provided - error 400 bad request', async () => {
                const request = {
                    "longitude": 4.66234,
                    "timestamp": 65448646
                };
                options.body = JSON.stringify(request);
                const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
                expect(data.error.code).toBe(400);
            });
            test('Latitude provided as string - error 400 bad request', async () => {
                const request = {
                    "latitude": "52.3873977",
                    "longitude": 4.66234,
                    "timestamp": 65448646
                };
                options.body = JSON.stringify(request);
                const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
                expect(data.error.code).toBe(400);
            });
            test('Latitude as SQL Injection - error 400 bad request', async () => {
                const request = {
                    "latitude": "DROP TABLE",
                    "longitude": 4.66234,
                    "timestamp": 65448646
                };
                options.body = JSON.stringify(request);
                const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
                expect(data.error.code).toBe(400);
            });
        })
        describe('Errors with longitude', () => {
            test('No longitude provided - error 400 bad request', async () => {
                const request = {
                    "latitude": 52.3873977,
                    "timestamp": 65448646
                };
                options.body = JSON.stringify(request);
                const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
                expect(data.error.code).toBe(400);
            });
            test('Longitude provided as string - error 400 bad request', async () => {
                const request = {
                    "latitude": 52.3873977,
                    "longitude": "4.66234",
                    "timestamp": 65448646
                };
                options.body = JSON.stringify(request);
                const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
                expect(data.error.code).toBe(400);
            });
            test('Longitude as SQL Injection - error 400 bad request', async () => {
                const request = {
                    "latitude": 52.3873977,
                    "longitude": "DROP Table",
                    "timestamp": 65448646
                };
                options.body = JSON.stringify(request);
                const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
                expect(data.error.code).toBe(400);
            });
        })
        describe('Errors with timestamp', () => {
            test('No timestamp provided - error 400 bad request', async () => {
                const request = {
                    "latitude": 52.3873977,
                    "longitude": 4.66234
                };
                options.body = JSON.stringify(request);
                const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
                expect(data.error.code).toBe(400);
            });
            test('Timestamp provided as string - error 400 bad request', async () => {
                const request = {
                    "latitude": 52.3873977,
                    "longitude": 4.66234,
                    "timestamp": "65448646"
                };
                options.body = JSON.stringify(request);
                const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
                expect(data.error.code).toBe(400);
            });
            test('Timestamp as SQL Injection - error 400 bad request', async () => {
                const request = {
                    "latitude": 52.3873977,
                    "longitude": 4.66234,
                    "timestamp": "DROP TABLE"
                };
                options.body = JSON.stringify(request);
                const data = await getDataWithOptions(`${apiURL}${orderNumber}/postExpertPosition?key=${orderKey}`, options);
                expect(data.error.code).toBe(400);
            });
        })
    })
});