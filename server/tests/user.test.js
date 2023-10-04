const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require('bcryptjs')
const app = require("../app");
const User = require("../models/user.model");

require("dotenv").config({ path: "./tests/.env" });

user = {
    username: "test",
    password: "test"
}

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await new User({ 
        username: "test", 
        password: await bcrypt.hash("test", 10) 
    }).save();
});
  
afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe("GET /api/user", () => {
    it("should return 401 if not logged in", async () => {
        const response = await request(app).get("/api/user");
        expect(response.status).toBe(401);
    });

    it("should return 200 if logged in", async () => {
        let response = await request(app)
            .post("/api/login")
            .auth(user.username, user.password);
        expect(response.status).toBe(200);

        const cookie = response.headers['set-cookie'];
        response = await request(app)
            .get("/api/user")
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.username).toBe(user.username);
    });
});

describe("PATCH /api/user", () => {
    it("should return 401 if not logged in", async () => {
        const response = await request(app).patch("/api/user");
        expect(response.status).toBe(401);
    });

    it("should return 204 if logged in", async () => {
        let response = await request(app)
            .post("/api/login")
            .auth(user.username, user.password);
        expect(response.status).toBe(200);

        const cookie = response.headers['set-cookie'];
        const newpassword = "newpassword";
        response = await request(app)
            .patch("/api/user")
            .set('Cookie', cookie)
            .send({ password: newpassword });
        expect(response.status).toBe(204);

        response = await request(app)
            .post("/api/login")
            .auth(user.username, newpassword);
        console.log(response.body);
        expect(response.status).toBe(200);
    });
});