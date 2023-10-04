const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require('bcryptjs')
const app = require("../app");
const User = require("../models/user.model");
const Item = require("../models/item.model");

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

describe("GET /api/profile", () => {
    it("should return 401 if not logged in", async () => {
        const response = await request(app).get("/api/profile");
        expect(response.status).toBe(401);
    });

    it("should return 200 if logged in", async () => {
        let response = await request(app)
            .post("/api/login")
            .auth(user.username, user.password);
        expect(response.status).toBe(200);

        const cookie = response.headers['set-cookie'];
        response = await request(app)
            .get("/api/profile")
            .set('Cookie', cookie);
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
        let response = await request(app)
            .post("/api/login")
            .auth(user.username, user.password);
        expect(response.status).toBe(200);

        const cookie = response.headers['set-cookie'];
        const newpassword = "newpassword";
        response = await request(app)
            .patch("/api/profile")
            .set('Cookie', cookie)
            .send({ password: newpassword });
        expect(response.status).toBe(204);

        response = await request(app)
            .post("/api/login")
            .auth(user.username, newpassword);
        expect(response.status).toBe(200);

        user.password = newpassword;
    });
});

describe("GET /api/profile/items", () => {
    it("should return 401 if not logged in", async () => {
        const response = await request(app).get("/api/profile/items");
        expect(response.status).toBe(401);
    });

    it("should return 200 if logged in", async () => {
        let response = await request(app)
            .post("/api/login")
            .auth(user.username, user.password);
        expect(response.status).toBe(200);

        const cookie = response.headers['set-cookie'];
        response = await request(app)
            .get("/api/profile/items")
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);

        const owner = await User.findOne({ username: user.username });
        for (let i = 0; i < 3; i++) {
            await new Item({ 
                owner: owner._id,
                name: `test${i}` 
            }).save();
        }

        response = await request(app)
            .get("/api/profile/items")
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3);

        response = await request(app)
            .get("/api/profile/items")
            .query({ offset: 1, limit: 1 })
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe("test1");

        const itemId = response.body[0]._id;
        response = await request(app)
            .get(`/api/profile/items/${itemId}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("test1");
    });

    afterAll(async () => { await Item.deleteMany({}); });
});

describe("POST /api/profile/items", () => {
    it("should return 401 if not logged in", async () => {
        const response = await request(app).post("/api/profile/items");
        expect(response.status).toBe(401);
    });

    it("should return 201 if logged in", async () => {
        let response = await request(app)
            .post("/api/login")
            .auth(user.username, user.password);
        expect(response.status).toBe(200);

        const cookie = response.headers['set-cookie'];
        response = await request(app)
            .post("/api/profile/items")
            .set('Cookie', cookie)
            .send({ name: "test" });
        expect(response.status).toBe(201);
        expect(response.body.name).toBe("test");

        const item = await Item.findOne({ name: "test" });
        const owner = await User.findOne({ username: user.username });
        expect(item).not.toBeNull();
        expect(item._id.toString()).toBe(response.body._id);
        expect(item.owner.toString()).toBe(owner._id.toString());
    });

    afterAll(async () => { await Item.deleteMany({}); });
});

describe("PATCH /api/profile/items/:id", () => {
    it("should return 401 if not logged in", async () => {
        const response = await request(app).patch("/api/profile/items/1");
        expect(response.status).toBe(401);
    });

    it("should return 204 if logged in", async () => {
        let response = await request(app)
            .post("/api/login")
            .auth(user.username, user.password);
        expect(response.status).toBe(200);

        const cookie = response.headers['set-cookie'];
        const owner = await User.findOne({ username: user.username });
        const item = await new Item({ 
            owner: owner._id,
            name: "test" 
        }).save();

        response = await request(app)
            .patch(`/api/profile/items/${item._id}`)
            .set('Cookie', cookie)
            .send({ name: "test2", tags: ["test"] });
        expect(response.status).toBe(204);

        const updatedItem = await Item.findOne({ _id: item._id });
        expect(updatedItem.name).toBe("test2");
        expect(updatedItem.tags).toEqual(["test"]);
    });

    afterAll(async () => { await Item.deleteMany({}); });
});

describe("DELETE /api/profile/items/:id", () => {
    it("should return 401 if not logged in", async () => {
        const response = await request(app).delete("/api/profile/items/1");
        expect(response.status).toBe(401);
    });

    it("should return 204 if logged in", async () => {
        let response = await request(app)
            .post("/api/login")
            .auth(user.username, user.password);
        expect(response.status).toBe(200);

        const cookie = response.headers['set-cookie'];
        const owner = await User.findOne({ username: user.username });
        const item = await new Item({ 
            owner: owner._id,
            name: "test" 
        }).save();

        response = await request(app)
            .delete(`/api/profile/items/${item._id}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(204);

        const deletedItem = await Item.findOne({ _id: item._id });
        expect(deletedItem).toBeNull();
    });
});