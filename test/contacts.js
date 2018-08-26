const appSecret = "test-app-secret";
process.env.APP_SECRET = appSecret;

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const server = require('../app');
const assert = chai.assert;

chai.use(chaiHttp);

describe("contact management", () => {
    describe("/POST users/contact", () => {
        const userEmail = "abcd@efcd.com"
        const userPassword = "V1ngrdiasdiousa"
        let token;

        // create user and login for retrieving token used in following test scenarios
        before(async () => {
            regResponse = await chai.request(server)
                .post("/users")
                .set("Content-Type", "application/json")
                .send({email: userEmail, password: userPassword});

            if (regResponse.status != 200) {
                throw new Error(`couldn't register new user: ${regResponse.body}`);
            }
            
            loginResponse = await chai.request(server)
                .post("/users/login")
                .set("Content-type", "application/json")
                .send({email: userEmail, password: userPassword});
            
            if (loginResponse.status != 200 || loginResponse.type != "application/json") {
                throw new Error(`couldn't register new user: ${regResponse.body}`);
            }
            token = loginResponse.body.token;
            jwt.verify(token, appSecret);
        })

        it("should create contact for user from token", async () => {

            response = await chai.request(server)
                .post("/users/contact")
                .set("Content-Type", "application/json")
                .set("auth-token", token)
                .send({"phone": "123456", "address": "Rohanské nábř. 678/23, 186 00 Praha 8-Karlín"});

            assert.equal(response.status, 200);
        

        });
    });
});