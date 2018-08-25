const appSecret = "test-app-secret";
process.env.APP_SECRET = appSecret;

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const server = require('../app');
const assert = chai.assert;

chai.use(chaiHttp);

describe("user management", () => {
    describe("/POST users", () => {
        it("it should create a user", async () => {
            const userEmail = "wuuuf-is-this@dog.com"
            const userPassword = "heslo1234"
            response = await chai.request(server)
                .post("/users")
                .set("Content-type", "application/json")
                .send({email: userEmail, password: userPassword});
            
            assert.equal(response.status, 200);
            assert.equal(response.type, "application/json");
            assert.equal(response.body.email, userEmail);
            assert.exists(response.body.id);
            assert.exists(response.body.createdAt);
        });
    });

    describe("/POST login", () => {
        it("should return valid jwt token", async () => {
            const userEmail = "henry@pjotr.com"
            const userPassword = "vingardiumleviousa"
            regResponse = await chai.request(server)
                .post("/users")
                .set("Content-type", "application/json")
                .send({email: userEmail, password: userPassword});
            assert.equal(regResponse.status, 200);
            
            loginResponse = await chai.request(server)
                .post("/users/login")
                .set("Content-type", "application/json")
                .send({email: userEmail, password: userPassword});
            
            assert.equal(loginResponse.status, 200);
            assert.equal(loginResponse.type, "application/json");
            const token = jwt.verify(loginResponse.body.token, appSecret)
            assert.equal(token.email, userEmail);
        });
    });
});