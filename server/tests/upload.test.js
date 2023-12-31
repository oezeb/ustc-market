const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const fs = require("fs");

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

const tux = "./tests/tux.svg.png";
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

describe("POST /api/upload/images", () => {
    it("should return 401 if not logged in", async () => {
        const response = await request(app).post("/api/upload/images");
        expect(response.status).toBe(401);
    });

    it("should return 201 if logged in", async () => {
        const response = await request(app)
            .post("/api/upload/images")
            .set("Cookie", cookie)
            .attach("image", tux);
        expect(response.status).toBe(201);
        expect(response.body.length).toBe(1);
        expect(fs.existsSync(response.body[0])).toBe(true);
        fs.unlinkSync(response.body[0]);
    });
});
