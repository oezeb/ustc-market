const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require('bcryptjs')
const app = require("../app");
const User = require("../models/user.model");
const Item = require("../models/item.model");
const Message = require("../models/message.model");

require("dotenv").config({ path: "./tests/.env" });

const login = async (user) => {
    const response = await request(app)
        .post("/api/login")
        .auth(user.username, user.password);
    expect(response.status).toBe(200);
    return response.headers['set-cookie'];
};

const user = {
    username: "test",
    password: "test"
}
var cookie;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const model = await new User({
        username: user.username,
        password: await bcrypt.hash(user.password, 10)
    }).save();
    user._id = model._id;
    cookie = await login(user);
});
  
afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

// =============================================================================
// Profile
// =============================================================================

describe("GET /api/profile", () => {
    it("should return 401 if not logged in", async () => {
        const response = await request(app).get("/api/profile");
        expect(response.status).toBe(401);
    });

    it("should return 200 if logged in", async () => {
        let response = await request(app)
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
        const newpassword = "newpassword";
        let response = await request(app)
            .patch("/api/profile")
            .set('Cookie', cookie)
            .send({ password: newpassword });
        expect(response.status).toBe(204);

        user.password = newpassword;
        cookie = await login(user);
    });
});

// =============================================================================
// Profile Items
// =============================================================================

describe("GET /api/profile/items", () => {
    var items = [];

    beforeAll(async () => {
        for (let i = 0; i < 3; i++) {
            items.push(
                await new Item({
                    owner: user._id,
                    name: `test${i}`
                }).save()
            );
        }
    });

    afterAll(async () => { await Item.deleteMany({}); });

    it("should return 401 if not logged in", async () => {
        const response = await request(app).get("/api/profile/items");
        expect(response.status).toBe(401);
    });

    it("should return 200 if logged in", async () => {
        let response = await request(app)
            .get("/api/profile/items")
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(items.length);

        response = await request(app)
            .get("/api/profile/items")
            .query({ offset: 1, limit: 1 })
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe(items[1].name);

        const itemId = response.body[0]._id;
        response = await request(app)
            .get(`/api/profile/items/${itemId}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(items[1].name);
    });
});

describe("POST /api/profile/items", () => {
    afterAll(async () => { await Item.deleteMany({}); });

    it("should return 401 if not logged in", async () => {
        const response = await request(app).post("/api/profile/items");
        expect(response.status).toBe(401);
    });

    it("should return 201 if logged in", async () => {
        let response = await request(app)
            .post("/api/profile/items")
            .set('Cookie', cookie)
            .send({ name: "test" });
        expect(response.status).toBe(201);
        expect(response.body.name).toBe("test");

        const item = await Item.findOne({ name: "test" });
        expect(item).not.toBeNull();
        expect(item._id.toString()).toBe(response.body._id);
        expect(item.owner.toString()).toBe(user._id.toString());
    });
});

describe("PATCH /api/profile/items/:id", () => {
    var itemId;

    beforeAll(async () => {
        const item = await new Item({
            owner: user._id,
            name: "test"
        }).save();
        itemId = item._id;
    });

    afterAll(async () => { await Item.deleteMany({}); });

    it("should return 401 if not logged in", async () => {
        const response = await request(app).patch(`/api/profile/items/${itemId}`);
        expect(response.status).toBe(401);
    });

    it("should return 204 if logged in", async () => {
        let response = await request(app)
            .patch(`/api/profile/items/${itemId}`)
            .set('Cookie', cookie)
            .send({ name: "test2", tags: ["test"] });
        expect(response.status).toBe(204);

        const updatedItem = await Item.findOne({ _id: itemId });
        expect(updatedItem.name).toBe("test2");
        expect(updatedItem.tags).toEqual(["test"]);
    });
});

describe("DELETE /api/profile/items/:id", () => {
    var itemId;
    beforeAll(async () => {
        const item = await new Item({
            owner: user._id,
            name: "test"
        }).save();
        itemId = item._id;
    });

    it("should return 401 if not logged in", async () => {
        const response = await request(app).delete(`/api/profile/items/${itemId}`);
        expect(response.status).toBe(401);
    });

    it("should return 204 if logged in", async () => {
        let response = await request(app)
            .delete(`/api/profile/items/${itemId}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(204);

        const deletedItem = await Item.findOne({ _id: itemId });
        expect(deletedItem).toBeNull();
    });
});
