const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcryptjs");

const app = require("../app");
const config = require("../config");
const User = require("../models/user.model");
const { before } = require("node:test");

beforeAll(async () => {
    await mongoose.connect(config.MONDODB_TEST_URI);
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe("POST /api/auth/login", () => {
    var userId;

    beforeAll(async () => {
        const user = await new User({
            username: "test",
            email: "test@ustc.edu.cn",
            password: await bcrypt.hash("test", 10),
            emailVerified: true,
        }).save();
        userId = user._id;
    });

    it("should return 404 if user not found", async () => {
        response = await request(app)
            .post("/api/auth/login")
            .auth("not-found", "test");
        expect(response.status).toBe(404);
    });

    it("should return 401 if password does not match", async () => {
        response = await request(app)
            .post("/api/auth/login")
            .auth("test", "wrong");
        expect(response.status).toBe(401);
    });

    it("should return 200 if login successful", async () => {
        response = await request(app)
            .post("/api/auth/login")
            .auth("test", "test");
        expect(response.status).toBe(200);
        response = await request(app)
            .post("/api/auth/login")
            .auth("test@ustc.edu.cn", "test");
        expect(response.status).toBe(200);
    });

    it("should return 403 if email not verified", async () => {
        await User.findByIdAndUpdate(userId, { emailVerified: false });
        response = await request(app)
            .post("/api/auth/login")
            .auth("test", "test");
        expect(response.status).toBe(403);
    });
});
