import http from 'k6/http';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import { group, check } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';



// let auth_url = 'https://authpodstaging.sicepat.com'
let base_url = 'http://pretest-qa.dcidev.id'
let endpoint =  base_url + '/api/v1/register';

export function handleSummary(data) {
    return {
      'register/summary.html': htmlReport(data),
    };
};

export const options = {
    stages: [
      { duration: "5s", target: 10 },
    //   { duration: "30s", target: 10 },
    //   { duration: "1m", target: 10 },
    //   { duration: "30s", target: 5 },
    //   { duration: "30s", target: 0 },
    ],
};

export default function () {
    //init data
    let range = {min: 200, max: 1500}
    let delta = range.max - range.min

    const randomNumber = Math.round(range.min + Math.random() * delta)

    let PhoneNumberiOS = '628109100' + randomNumber
    group('Register User', function () {
        
        const bodyReq = {
            "phone": `${PhoneNumberiOS}`,
            "password": "123123",
            "country": "ID",
            "latlong": "‑6.200000-106.816666",
            "device_token": "123",
            "device_type": "0"
        }
        let headers = {
            'content-type': 'application/x-www-form-urlencoded',
        }

        let response = http.post(endpoint, bodyReq, {headers});
        console.log(response.body);
        check(response, {
            'Response status is 201': (r) => r.status === 201,
            'status is not 400': (r) => r.status !== 400,
            'status is not 422': (r) => r.status !== 422,
            'status is not 500': (r) => r.status !== 500,
        });
        const body = JSON.parse(response.body);
        });

};