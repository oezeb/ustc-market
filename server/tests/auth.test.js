const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require('bcryptjs')
const app = require("../app");
const config = require('../config');
const User = require("../models/user.model");

require("dotenv").config({ path: "./tests/.env" });

beforeAll(async () => {
    await mongoose.connect(config.MONGODB_URI);
});
  
afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe("POST /api/auth/login", () => {
    it("should return 404 if user not found", async () => {
        const response = await request(app).post("/api/auth/login").auth("test", "test");
        expect(response.status).toBe(404);
    });

    it("should return 401 if password does not match", async () => {
        await new User({ username: "test", password: await bcrypt.hash("test", 10) }).save();
        const response = await request(app).post("/api/auth/login").auth("test", "wrong");
        expect(response.status).toBe(401);
    });

    it("should return 200 if login successful", async () => {
        const response = await request(app).post("/api/auth/login").auth("test", "test");
        expect(response.status).toBe(200);
    });
});
