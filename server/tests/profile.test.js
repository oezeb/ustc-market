const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../app");
const config = require("../config");
const User = require("../models/user.model");
const Item = require("../models/item.model");
const Message = require("../models/message.model");
const fs = require("fs");

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
        password: await bcrypt.hash(user.password, 10),
    }).save();

const newItem = async (user) =>
    new Item({
        owner: user._id,
        description: `${user.username}'s item`,
    }).save();

const newMessage = async (sender, receiver, item) =>
    new Message({
        sender: sender._id,
        receiver: receiver._id,
        item: item._id,
        content: `${sender.username} to ${receiver.username}`,
    }).save();

const user = {
    username: "test",
    password: "test",
};
var cookie;
const tuxPath = "./tests/tux.svg.png";

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
            .attach("avatar", tuxPath)
            .field("name", "test")
            .field("password", newpassword);
        expect(response.status).toBe(204);
        const mUser = await User.findById(user._id);
        expect(mUser.name).toBe("test");
        expect(mUser.avatar).toBe(`${config.avatarsDir}/${user._id}.jpeg`);
        expect(fs.existsSync(mUser.avatar)).toBe(true);
        fs.unlinkSync(mUser.avatar);

        user.password = newpassword;
        cookie = await login(user);
    });
});

// =============================================================================
// Profile Items
// =============================================================================

describe("POST /api/profile/items", () => {
    afterAll(async () => {
        await Item.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        const response = await request(app).post("/api/profile/items");
        expect(response.status).toBe(401);
    });

    it("should return 201 if logged in", async () => {
        let response = await request(app)
            .post("/api/profile/items")
            .set("Cookie", cookie)
            .attach("images", tuxPath)
            .attach("images", tuxPath)
            .field("description", "test")
            .field("tags", JSON.stringify(["test", "test"]));
        expect(response.status).toBe(201);
        expect(response.body.tags).toEqual(["test"]);
        expect(response.body.images.length).toBe(2);
        response.body.images.forEach((image) => {
            expect(fs.existsSync(image)).toBe(true);
            fs.unlinkSync(image);
        });

        const item = await Item.findById(response.body._id);
        expect(`${item.owner}`).toBe(user._id);
    });
});

describe("PATCH /api/profile/items/:id", () => {
    var itemId;

    beforeAll(async () => {
        const item = await newItem(user);
        itemId = item._id;
    });

    afterAll(async () => {
        await Item.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        const response = await request(app).patch(
            `/api/profile/items/${itemId}`
        );
        expect(response.status).toBe(401);
    });

    it("should return 204 if logged in", async () => {
        let response = await request(app)
            .patch(`/api/profile/items/${itemId}`)
            .set("Cookie", cookie)
            .attach("images", tuxPath)
            .field("description", "test2")
            .field("tags", JSON.stringify(["test", "test"]));
        expect(response.status).toBe(204);

        let updatedItem = await Item.findById(itemId);
        expect(updatedItem.tags).toEqual(["test"]);
        expect(updatedItem.images.length).toBe(1);
        expect(fs.existsSync(updatedItem.images[0])).toBe(true);

        response = await request(app)
            .patch(`/api/profile/items/${itemId}`)
            .set("Cookie", cookie)
            .attach("images", tuxPath)
            .field("replaceTags", true)
            .field("tags", JSON.stringify(["test2"]));
        expect(response.status).toBe(204);

        updatedItem = await Item.findById(itemId);
        expect(updatedItem.tags).toEqual(["test2"]);
        expect(updatedItem.images.length).toBe(2);
        updatedItem.images.forEach((image) => {
            expect(fs.existsSync(image)).toBe(true);
            fs.unlinkSync(image);
        });

        response = await request(app)
            .patch(`/api/profile/items/${itemId}`)
            .set("Cookie", cookie)
            .attach("images", tuxPath)
            .field("replaceImages", true)
            .field("tags", JSON.stringify(["test3"]));
        expect(response.status).toBe(204);

        updatedItem = await Item.findById(itemId);
        expect(new Set(updatedItem.tags)).toEqual(new Set(["test2", "test3"]));
        expect(updatedItem.images.length).toBe(1);
        expect(fs.existsSync(updatedItem.images[0])).toBe(true);
        fs.unlinkSync(updatedItem.images[0]);
    });
});

describe("DELETE /api/profile/items/:id", () => {
    var itemId;
    beforeAll(async () => {
        const item = await newItem(user);
        itemId = item._id;
    });

    it("should return 401 if not logged in", async () => {
        const response = await request(app).delete(
            `/api/profile/items/${itemId}`
        );
        expect(response.status).toBe(401);
    });

    it("should return 204 if logged in", async () => {
        let response = await request(app)
            .delete(`/api/profile/items/${itemId}`)
            .set("Cookie", cookie);
        expect(response.status).toBe(204);

        const deletedItem = await Item.findOne({ _id: itemId });
        expect(deletedItem).toBeNull();
    });
});

// =============================================================================
// Profile Messages
// =============================================================================

describe("GET /api/profile/messages", () => {
    var mUser, mItem;

    beforeAll(async () => {
        for (let i of [1, 2]) {
            mUser = await newUser({
                username: `test${i}`,
                password: `test${i}`,
            });
            for (let j = 0; j < 2; j++) {
                mItem = await newItem(mUser);
                await newMessage(user, mUser, mItem);
                await newMessage(mUser, user, mItem);
            }
        }
    });

    afterAll(async () => {
        await User.deleteMany({ _id: { $ne: user._id } });
        await Item.deleteMany({});
        await Message.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        const response = await request(app).get("/api/profile/messages");
        expect(response.status).toBe(401);
    });

    it("should return 200 if logged in", async () => {
        let response = await request(app)
            .get("/api/profile/messages")
            .query({
                otherUser: `${mUser._id}`,
                item: `${mItem._id}`,
            })
            .set("Cookie", cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        response.body.forEach((message) => {
            expect(`${message.item}`).toBe(`${mItem._id}`);
            if (`${message.sender}` === user._id) {
                expect(message.content).toBe(
                    `${user.username} to ${mUser.username}`
                );
            } else {
                expect(message.content).toBe(
                    `${mUser.username} to ${user.username}`
                );
            }
        });

        response = await request(app)
            .get("/api/profile/messages")
            .query({ offset: 1, limit: 1 })
            .set("Cookie", cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);

        const message = response.body[0];
        response = await request(app)
            .get(`/api/profile/messages/${message._id}`)
            .set("Cookie", cookie);
        expect(response.status).toBe(200);
        expect(response.body.content).toBe(message.content);
    });
});

describe("GET /api/profile/messages/count", () => {
    var item;
    beforeAll(async () => {
        item = await newItem(user);
    });

    afterAll(async () => {
        Item.deleteMany({});
        Message.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        const response = await request(app).get("/api/profile/messages/count");
        expect(response.status).toBe(401);
    });

    it("should return 200 if logged in", async () => {
        let response = await request(app)
            .get("/api/profile/messages/count")
            .query({ item: `${item._id}` })
            .set("Cookie", cookie);
        expect(response.status).toBe(200);
        expect(response.body).toBe(0);

        await newMessage(user, user, item);
        response = await request(app)
            .get("/api/profile/messages/count")
            .query({ item: `${item._id}` })
            .set("Cookie", cookie);
        expect(response.status).toBe(200);
        expect(response.body).toBe(1);
    });
});

describe("POST /api/profile/messages", () => {
    var mItem;

    beforeAll(async () => {
        let mUser = await newUser({ username: "test2", password: "test2" });
        mItem = await newItem(mUser);
    });

    afterAll(async () => {
        await User.deleteMany({ _id: { $ne: user._id } });
        await Item.deleteMany({});
        await Message.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        const response = await request(app).post("/api/profile/messages");
        expect(response.status).toBe(401);
    });

    it("should return 201 if logged in", async () => {
        let response = await request(app)
            .post("/api/profile/messages")
            .set("Cookie", cookie)
            .send({
                item: `${mItem._id}`,
                content: "test",
            });
        expect(response.status).toBe(201);
        expect(response.body.blocked).toBe(false);

        const mUser = await User.findById(mItem.owner);
        mUser.blockedUsers = [user._id];
        await mUser.save();

        response = await request(app)
            .post("/api/profile/messages")
            .set("Cookie", cookie)
            .send({
                item: `${mItem._id}`,
                content: "test2",
            });
        expect(response.status).toBe(201);
        expect(response.body.blocked).toBe(true);
    });
});
