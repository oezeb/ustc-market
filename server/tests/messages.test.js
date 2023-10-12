const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcryptjs");

const app = require("../app");
const config = require("../config");
const { encrypt } = require("../encryption");
const User = require("../models/user.model");
const Item = require("../models/item.model");
const Message = require("../models/message.model");

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
        content: encrypt(`${sender.username} to ${receiver.username}`),
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

describe("GET /api/messages", () => {
    const user1 = { username: "test1", password: "test1" };
    const user2 = { username: "test2", password: "test2" };
    var user1Item, user2Item;

    beforeAll(async () => {
        model = await newUser(user1);
        user1._id = `${model._id}`;

        model = await newUser(user2);
        user2._id = `${model._id}`;

        user1Item = {
            owner: user1._id,
            description: `${user1.username}'s item`,
        };
        model = await new Item(user1Item).save();
        user1Item._id = `${model._id}`;

        user2Item = {
            owner: user2._id,
            description: `${user2.username}'s item`,
        };
        model = await new Item(user2Item).save();
        user2Item._id = `${model._id}`;

        await newMessage(user, user1, user1Item);
        await newMessage(user, user2, user2Item);
        await newMessage(user1, user, user1Item);
        await newMessage(user1, user2, user2Item);
        await newMessage(user2, user, user2Item);
        await newMessage(user2, user1, user1Item);
    });

    afterAll(async () => {
        await User.deleteMany({ _id: { $ne: user._id } });
        await Item.deleteMany({});
        await Message.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        response = await request(app).get("/api/messages");
        expect(response.status).toBe(401);
    });

    it("filter by sender", async () => {
        response = await request(app)
            .get("/api/messages")
            .set("Cookie", cookie)
            .query({ sender: user1._id });
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].sender).toBe(user1._id);
        expect(response.body[0].receiver).toBe(user._id);
    });

    it("filter by receiver", async () => {
        response = await request(app)
            .get("/api/messages")
            .set("Cookie", cookie)
            .query({ receiver: user1._id });
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].sender).toBe(user._id);
        expect(response.body[0].receiver).toBe(user1._id);
    });

    it("filter by item", async () => {
        response = await request(app)
            .get("/api/messages")
            .set("Cookie", cookie)
            .query({ item: user1Item._id });
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].item).toBe(user1Item._id);
        expect(response.body[1].item).toBe(user1Item._id);
    });

    it("filter by otherUser", async () => {
        response = await request(app)
            .get("/api/messages")
            .set("Cookie", cookie)
            .query({ otherUser: user1._id });
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        const receivers = response.body.map((msg) => msg.receiver);
        const senders = response.body.map((msg) => msg.sender);
        expect(new Set([...receivers, ...senders])).toEqual(
            new Set([user._id, user1._id])
        );
    });

    it("limit, offset and fields filtering", async () => {
        response = await request(app)
            .get("/api/messages")
            .set("Cookie", cookie)
            .query({
                limit: 1,
                offset: 1,
                fields: "sender,receiver",
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(new Set(Object.keys(response.body[0]))).toEqual(
            new Set(["_id", "sender", "receiver"])
        );
    });

    it("GET /api/messages/:id", async () => {
        msg = await Message.findOne({
            $or: [{ sender: user._id }, { receiver: user._id }],
        });
        response = await request(app)
            .get(`/api/messages/${msg._id}`)
            .set("Cookie", cookie);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(`${msg._id}`);
        expect(response.body.sender).toBe(`${msg.sender}`);
        expect(response.body.receiver).toBe(`${msg.receiver}`);
        expect(response.body.item).toBe(`${msg.item}`);

        msg = await Message.findOne({
            receiver: { $ne: user._id },
            sender: { $ne: user._id },
        });
        response = await request(app)
            .get(`/api/messages/${msg._id}`)
            .set("Cookie", cookie);
        expect(response.status).toBe(400);
    });

    it("GET /api/messages/count", async () => {
        response = await request(app)
            .get("/api/messages/count")
            .set("Cookie", cookie);
        expect(response.status).toBe(200);
        expect(response.body).toBe(4);
    });
});

describe("POST /api/messages", () => {
    const mUser = { username: "mUser", password: "mUser" };
    var itemId, mItemId;

    beforeAll(async () => {
        model = await newUser(mUser);
        mUser._id = `${model._id}`;

        model = await newItem(user);
        itemId = `${model._id}`;

        model = await newItem(mUser);
        mItemId = `${model._id}`;
    });

    afterAll(async () => {
        await User.deleteMany({ _id: { $ne: user._id } });
        await Item.deleteMany({});
        await Message.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        response = await request(app).post("/api/messages");
        expect(response.status).toBe(401);
    });

    it("should return 400 if item not found", async () => {
        response = await request(app)
            .post("/api/messages")
            .set("Cookie", cookie)
            .send({ receiver: mUser._id, item: "123456789012" });
        expect(response.status).toBe(400);
    });

    it("Item owner is the one initiating the conversation", async () => {
        response = await request(app)
            .post("/api/messages")
            .set("Cookie", cookie)
            .send({ receiver: mUser._id, item: itemId });
        expect(response.status).toBe(400);
    });

    it("should create a new message", async () => {
        response = await request(app)
            .post("/api/messages")
            .set("Cookie", cookie)
            .send({ receiver: mUser._id, item: mItemId, content: "test" });
        expect(response.status).toBe(200);
        expect(response.body.sender).toBe(user._id);
        expect(response.body.receiver).toBe(mUser._id);
        expect(response.body.item).toBe(mItemId);
        expect(response.body.blocked).toBe(false);

        await User.findByIdAndUpdate(mUser._id, { blockedUsers: [user._id] });

        response = await request(app)
            .post("/api/messages")
            .set("Cookie", cookie)
            .send({ receiver: mUser._id, item: mItemId, content: "test" });
        expect(response.status).toBe(200);
        expect(response.body.blocked).toBe(true);
    });
});

describe("PATCH /api/messages/:id", () => {
    const mUser = { username: "mUser", password: "mUser" };
    var itemId, mItemId;

    beforeAll(async () => {
        model = await newUser(mUser);
        mUser._id = `${model._id}`;

        model = await newItem(user);
        itemId = `${model._id}`;

        model = await newItem(mUser);
        mItemId = `${model._id}`;
    });

    afterAll(async () => {
        await User.deleteMany({ _id: { $ne: user._id } });
        await Item.deleteMany({});
        await Message.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        response = await request(app).patch("/api/messages/123456789012");
        expect(response.status).toBe(401);
    });

    it("should return 204 if is the receiver", async () => {
        msg = await newMessage(mUser, user, { _id: itemId });
        response = await request(app)
            .patch(`/api/messages/${msg._id}`)
            .set("Cookie", cookie)
            .send({ read: true });
        console.log(response.body);
        expect(response.status).toBe(204);
    });

    it("should return 400 if is not the receiver", async () => {
        msg = await newMessage(user, mUser, { _id: mItemId });
        response = await request(app)
            .patch(`/api/messages/${msg._id}`)
            .set("Cookie", cookie)
            .send({ read: true });
        expect(response.status).toBe(400);
    });
});
