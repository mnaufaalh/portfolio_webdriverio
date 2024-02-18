require('dotenv').config();
import got from 'got';
import { expect as chaiExpect } from 'chai';

class LoginFlow {
  async loginViaApi(email, password) {
    const loginUrl = `${process.env.URL_LUMEN}auth`;
    const response = await got({
      url: loginUrl,
      method: 'POST',
      json: {
        email: email,
        password: password
      }
    });
    chaiExpect(JSON.parse(response.body).status_code).to.equal(200);
    return {
      accessToken: JSON.parse(response.body).data.token
    };
  };
};

export default new LoginFlow();

