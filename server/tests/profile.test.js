const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcryptjs");

const app = require("../app");
const config = require("../config");
const User = require("../models/user.model");

const login = async (user) => {
    const response = await request(app)
        .post("/api/auth/login")
        .auth(user.username, user.password);
    expect(response.status).toBe(200);
    return response.headers["set-cookie"];
};

const newUser = async (user) =>
    new User({
        username: user.username,
        email: `${user.username}@ustc.edu.cn`,
        password: await bcrypt.hash(user.password, 10),
        emailVerified: true,
    }).save();

const user = {
    username: "test",
    password: "test",
};
var cookie;

beforeAll(async () => {
    await mongoose.connect(config.MONDODB_TEST_URI);
    const model = await newUser(user);
    user._id = `${model._id}`;
    cookie = await login(user);
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe("GET /api/profile", () => {
    it("should return 401 if not logged in", async () => {
        const response = await request(app).get("/api/profile");
        expect(response.status).toBe(401);
    });

    it("should return 200 if logged in", async () => {
        let response = await request(app)
            .get("/api/profile")
            .set("Cookie", cookie);
        expect(response.status).toBe(200);
        expect(response.body.username).toBe(user.username);
    });
});

describe("PATCH /api/profile", () => {
    it("should return 401 if not logged in", async () => {
        const response = await request(app).patch("/api/profile");
        expect(response.status).toBe(401);
    });

    it("should return 204 if logged in", async () => {
        const newpassword = "newpassword";
        let response = await request(app)
            .patch("/api/profile")
            .set("Cookie", cookie)
            .send({
                name: "test",
                password: newpassword,
            });
        expect(response.status).toBe(204);
        const mUser = await User.findById(user._id);
        expect(mUser.name).toBe("test");

        user.password = newpassword;
        cookie = await login(user);
    });
});
