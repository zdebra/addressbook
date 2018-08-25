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
        it("should create a user", async () => {
            const userEmail = "wuuuf-is-this@dog.com"
            const userPassword = "Heslo1234"
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
        it("should fail with insufficient password", async () => {
            const userEmail = "wuuuf-is-this@dog.com"
            const userPassword = "heslo"
            response = await chai.request(server)
                .post("/users")
                .set("Content-type", "application/json")
                .send({email: userEmail, password: userPassword});
            assert.equal(response.status, 400); 
        });
        it("should fail with invalid email", async () => {
            const userEmail = "wuuuf-is-this"
            const userPassword = "Heslo1234"
            response = await chai.request(server)
                .post("/users")
                .set("Content-type", "application/json")
                .send({email: userEmail, password: userPassword});
            assert.equal(response.status, 400); 
        });
    });

    describe("/POST login", () => {

        it("should return valid jwt token", async () => {
            const userEmail = "henry@pjotr.com"
            const userPassword = "V1ngrdiumleviousa"
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
            assert.exists(token.id, userEmail);
        });

        it("should fail with wrong password", async () => {
            const userEmail = "ron@wasilij.com"
            const userPassword = "V1ngrdiumleviousa"
            regResponse = await chai.request(server)
                .post("/users")
                .set("Content-type", "application/json")
                .send({email: userEmail, password: userPassword});
            assert.equal(regResponse.status, 200);
            
            loginResponse = await chai.request(server)
                .post("/users/login")
                .set("Content-type", "application/json")
                .send({email: userEmail, password: "wrong-password"});
            
            assert.equal(loginResponse.status, 401);
        });
        
        it("should fail with non existing user", async () => {
            loginResponse = await chai.request(server)
                .post("/users/login")
                .set("Content-type", "application/json")
                .send({email: "wrong-email@abcd.com", password: "wrong-password"});
            
            assert.equal(loginResponse.status, 404);
        });
    });
});