import request from 'superagent';
import moment from 'moment';
import Config from '../config';

class AuthApi {

  login(username, password) {
    const url = `${Config.restApi.baseUrl}/auth/login`;
    return request
      .post(url)
      .send({ts: moment().valueOf()})
      .send({username, password});
  }

  async login_old(username, password) {
    debugger;
    let response = await fetch(`${Config.restApi.baseUrl}/auth/login`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json', // <-- Specifying the Content-Type
      }),
      body: JSON.stringify({username, password}) // <-- Post parameters
    });
    return await response.json();
  }
}

export default AuthApi;
