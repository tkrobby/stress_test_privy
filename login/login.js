import http from 'k6/http';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import { group, check } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from 'k6/data';



let base_url = 'http://pretest-qa.dcidev.id'
let endpoint =  base_url + '/api/v1/oauth/sign_in';

export function handleSummary(data) {
    return {
      'login/summary.html': htmlReport(data),
    };
};

export const options = {
    stages: [
      { duration: "5s", target: 5 },
    //   { duration: "30s", target: 10 },
    //   { duration: "1m", target: 10 },
    //   { duration: "30s", target: 5 },
    //   { duration: "30s", target: 0 },
    ],
};


const csvRead = new SharedArray("transaction date", function () {
    return papaparse.parse(open('./data/data.csv'),{header: true}).data;
})

var param_phone = csvRead[Math.floor(Math.random() * csvRead.length)]['phone'];

const bodyReq = {
    phone: param_phone,
    password: "123123",
    latlong: "12312",
    device_token: "desc",
    device_type: "0"
}

export default function () {
    group('login', function () {
        let headers = {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept' : 'application/json'
        }

        let response = http.post(endpoint, bodyReq, {headers});
        check(response, {
            'Response status is 201': (r) => r.status === 201,
            'status is not 400': (r) => r.status !== 400,
            'status is not 422': (r) => r.status !== 422,
            'status is not 500': (r) => r.status !== 500,
        });
        const body = JSON.parse(response.body);
        });

};