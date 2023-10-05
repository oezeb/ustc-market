const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require('bcryptjs')
const app = require("../app");
const User = require("../models/user.model");

require("dotenv").config({ path: "./tests/.env" });

const login = async (user) => {
    const response = await request(app)
        .post("/api/login")
        .auth(user.username, user.password);
    expect(response.status).toBe(200);
    return response.headers['set-cookie'];
};

const newUser = async (user) => new User({
    username: user.username,
    password: await bcrypt.hash(user.password, 10)
}).save();

const user = {
    username: "test",
    password: "test"
}
var cookie;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({});
    const model = await newUser(user);
    user._id = `${model._id}`;
    cookie = await login(user);
});
  
afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe("GET /api/users", () => {
    var mUser;
    
    beforeAll(async () => {
        mUser = await newUser({
            username: "test2",
            password: "test2"
        });
    });

    it("should return 401 if not logged in", async () => {
        const response = await request(app).get(`/api/users/${mUser._id}`);
        expect(response.status).toBe(401);
    });

    it("should return 200 if user found", async () => {
        const response = await request(app)
            .get(`/api/users/${mUser._id}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(`${mUser._id}`);
        console.log(response.body);
        const fiels = new Set(["_id", "name", "avatar"]);
        expect(Object.keys(response.body).filter((key) => !fiels.has(key)).length).toBe(0);
    });
});
