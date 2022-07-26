import http from 'k6/http';
import { group, check } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';


let user_id = '229d4c5d-6854-4360-924d-b79c4f2149af'
let base_url = 'http://pretest-qa.dcidev.id'
let endpoint =  base_url + `/api/v1/message/${user_id}`;

export function handleSummary(data) {
    return {
      'get_message/summary.html': htmlReport(data),
    };
};

export const options = {
    stages: [
      { duration: "2s", target: 1 },
    //   { duration: "30s", target: 10 },
    //   { duration: "1m", target: 10 },
    //   { duration: "30s", target: 5 },
    //   { duration: "30s", target: 0 },
    ],
};

export function login(param_phone, password) {
    let headers = {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept' : 'application/json'
    }

    const bodyRequest = {
        phone: param_phone,
        password: password,
        latlong: "12312",
        device_token: "desc",
        device_type: "0"
    };

    const loginRes = http.post( base_url + '/api/v1/oauth/sign_in', bodyRequest, {headers});
    const respBody = JSON.parse(loginRes.body);
  
    const authToken = respBody.data.user.access_token;
  
    return authToken;
}

export default function () {
    const token = login('6289180101312', '123123');
    group('get message', function () {
        let headers = {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept' : 'application/json',
            'Authorization': `${token}`,
            
        }

        let response = http.get(endpoint, {headers});
        check(response, {
            'Response status is 200': (r) => r.status === 200,
            'status is not 400': (r) => r.status !== 400,
            'status is not 422': (r) => r.status !== 422,
            'status is not 500': (r) => r.status !== 500,
        });
        const body = JSON.parse(response.body);
        });

};