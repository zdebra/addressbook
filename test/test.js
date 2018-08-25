const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const assert = chai.assert;

chai.use(chaiHttp);

describe("user registration", () => {
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
});