const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcryptjs");

const app = require("../app");
const config = require("../config");
const User = require("../models/user.model");
const Item = require("../models/item.model");

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
    model = await newUser(user);
    user._id = `${model._id}`;
    cookie = await login(user);
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe("GET /api/items", () => {
    const user1 = { username: "test1", password: "test1" };
    const user2 = { username: "test2", password: "test2" };

    const user1Item = {
        price: 1,
        tags: ["tag1", "tag2"],
        description: "test1's item description",
    };
    const user2Item = {
        price: 2,
        tags: ["tag2", "tag3"],
        description: "test2's item description",
    };

    beforeAll(async () => {
        model = await newUser(user1);
        user1._id = `${model._id}`;

        model = await newUser(user2);
        user2._id = `${model._id}`;

        user1Item.owner = user1._id;
        model = await new Item(user1Item).save();
        user1Item._id = `${model._id}`;

        user2Item.owner = user2._id;
        model = await new Item(user2Item).save();
        user2Item._id = `${model._id}`;
    });

    afterAll(async () => {
        await User.deleteMany({ _id: { $ne: user._id } });
        await Item.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        let response = await request(app).get(`/api/items`);
        expect(response.status).toBe(401);
    });

    it("filter by owner", async () => {
        let response = await request(app)
            .get("/api/items")
            .set("Cookie", cookie)
            .query({ owner: user1._id });
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(user1Item._id);
    });

    it("filter by price", async () => {
        let response = await request(app)
            .get("/api/items")
            .set("Cookie", cookie)
            .query({ price: user1Item.price });
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(user1Item._id);

        response = await request(app)
            .get("/api/items")
            .set("Cookie", cookie)
            .query({ priceMin: user2Item.price });
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(user2Item._id);

        response = await request(app)
            .get("/api/items")
            .set("Cookie", cookie)
            .query({ priceMax: user1Item.price });
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(user1Item._id);
    });

    it("filter by tags", async () => {
        let response = await request(app)
            .get("/api/items")
            .set("Cookie", cookie)
            .query({ tags: user1Item.tags[0] });
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(user1Item._id);

        response = await request(app)
            .get("/api/items")
            .set("Cookie", cookie)
            .query({ tags: user1Item.tags[1] });
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);

        response = await request(app)
            .get("/api/items")
            .set("Cookie", cookie)
            .query({ tags: `${user1Item.tags[0]},${user2Item.tags[1]}` });
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it("filter by text", async () => {
        let response = await request(app)
            .get("/api/items")
            .set("Cookie", cookie)
            .query({ text: "test1's" });
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(user1Item._id);

        response = await request(app)
            .get("/api/items")
            .set("Cookie", cookie)
            .query({ text: "item" });
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it("custom sort", async () => {
        let response = await request(app)
            .get("/api/items")
            .set("Cookie", cookie)
            .query({ orderBy: "price", order: "asc" });
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0]._id).toBe(user1Item._id);
        expect(response.body[1]._id).toBe(user2Item._id);

        response = await request(app)
            .get("/api/items")
            .set("Cookie", cookie)
            .query({ orderBy: "price", order: "desc" });
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0]._id).toBe(user2Item._id);
        expect(response.body[1]._id).toBe(user1Item._id);
    });

    it("limit, offset and fields filtering", async () => {
        let response = await request(app)
            .get("/api/items")
            .set("Cookie", cookie)
            .query({ offset: 1, limit: 1, fields: "description,price" });
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(new Set(Object.keys(response.body[0]))).toEqual(
            new Set(["_id", "description", "price"])
        );
    });

    it("GET /api/items/:id", async () => {
        let response = await request(app)
            .get(`/api/items/${user1Item._id}`)
            .set("Cookie", cookie);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(user1Item._id);
    });
});

describe("GET /api/items/count", () => {
    afterAll(async () => {
        await Item.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        let response = await request(app).get(`/api/items/count`);
        expect(response.status).toBe(401);
    });

    it("should return item count", async () => {
        let response = await request(app)
            .get(`/api/items/count`)
            .set("Cookie", cookie);
        expect(response.status).toBe(200);
        expect(response.body).toBe(0);

        await new Item({ owner: user._id, description: "test" }).save();
        response = await request(app)
            .get(`/api/items/count`)
            .set("Cookie", cookie);
        expect(response.status).toBe(200);
        expect(response.body).toBe(1);
    });
});

describe("GET /api/items/tags", () => {
    const item1 = { description: "test1", tags: ["tag1", "tag3"] };
    const item2 = { description: "test2", tags: ["tag2", "tag3"] };
    const item3 = { description: "test3", tags: ["tag2", "tag3"] };

    beforeAll(async () => {
        for (let item of [item1, item2, item3]) {
            item.owner = user._id;
            await new Item(item).save();
        }
    });

    afterAll(async () => {
        await Item.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        let response = await request(app).get(`/api/items/tags`);
        expect(response.status).toBe(401);
    });

    it("should return tags with counts", async () => {
        let response = await request(app)
            .get(`/api/items/tags`)
            .set("Cookie", cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3);
        expect(response.body[0].tag).toBe("tag3");
        expect(response.body[0].count).toBe(3);
        expect(response.body[1].tag).toBe("tag2");
        expect(response.body[1].count).toBe(2);
        expect(response.body[2].tag).toBe("tag1");
    });
});

describe("POST /api/items", () => {
    afterAll(async () => {
        await Item.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        let response = await request(app).post(`/api/items`);
        expect(response.status).toBe(401);
    });

    it("should create a new item", async () => {
        let response = await request(app)
            .post("/api/items")
            .set("Cookie", cookie)
            .send({
                price: 1,
                description: "test",
                tags: ["tag", "tag"],
            });
        expect(response.status).toBe(201);
        expect(response.body._id).toBeDefined();
        expect(response.body.price).toBe(1);
        expect(response.body.description).toBe("test");
        expect(response.body.tags).toEqual(["tag"]);

        let item = await Item.findById(response.body._id);
        expect(item.price).toBe(1);
        expect(item.description).toBe("test");
        expect(item.tags).toEqual(["tag"]);
    });
});

describe("PATCH /api/items/:id", () => {
    var mCookie;
    var itemId;

    beforeAll(async () => {
        const mUser = { username: "mUser", password: "mUser" };
        await newUser(mUser);
        mCookie = await login(mUser);

        let item = await new Item({
            owner: user._id,
            description: "test",
        }).save();
        itemId = `${item._id}`;
    });

    afterAll(async () => {
        await User.deleteMany({ _id: { $ne: user._id } });
        await Item.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        let response = await request(app).patch(`/api/items/${itemId}`);
        expect(response.status).toBe(401);
    });

    it("should return 204 if item is updated", async () => {
        let response = await request(app)
            .patch(`/api/items/${itemId}`)
            .set("Cookie", cookie)
            .send({
                price: 1,
                description: "test2",
                tags: ["tag", "tag"],
            });
        expect(response.status).toBe(204);

        let item = await Item.findById(itemId);
        expect(item.price).toBe(1);
        expect(item.description).toBe("test2");
        expect(item.tags).toEqual(["tag"]);

        response = await request(app)
            .patch(`/api/items/${itemId}`)
            .set("Cookie", mCookie)
            .send({ price: 2 });
        expect(response.status).toBe(400);
    });
});

describe("DELETE /api/items/:id", () => {
    var mCookie;
    var itemId;

    beforeAll(async () => {
        const mUser = { username: "mUser", password: "mUser" };
        await newUser(mUser);
        mCookie = await login(mUser);

        let item = await new Item({
            owner: user._id,
            description: "test",
        }).save();
        itemId = `${item._id}`;
    });

    afterAll(async () => {
        await User.deleteMany({ _id: { $ne: user._id } });
        await Item.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        let response = await request(app).delete(`/api/items/${itemId}`);
        expect(response.status).toBe(401);
    });

    it("should return 204 if item is deleted", async () => {
        let response = await request(app)
            .delete(`/api/items/${itemId}`)
            .set("Cookie", cookie);
        expect(response.status).toBe(204);

        let item = await Item.findById(itemId);
        expect(item).toBe(null);

        response = await request(app)
            .delete(`/api/items/${itemId}`)
            .set("Cookie", mCookie);
        expect(response.status).toBe(400);
    });
});
