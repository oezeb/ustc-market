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

describe("GET /api/items", () => {
    const user1 = { username: "test1", password: "test1" };
    const user2 = { username: "test2", password: "test2" };
    
    const user1Item = { name: "test1's item", price: 1, tags: ["tag1", "tag2"], description: "test1's item description" };
    const user2Item = { name: "test2's item", price: 2, tags: ["tag2", "tag3"], description: "test2's item description" };
    
    beforeAll(async () => {
        let model;
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
        await User.deleteMany({});
        await Item.deleteMany({});
    });

    it("should return 401 if not logged in", async () => {
        let response = await request(app).get(`/api/items`);
        expect(response.status).toBe(401);
    });

    it("filter by owner", async () => {
        let response = await request(app)
            .get(`/api/items?owner=${user1._id}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(user1Item._id);
    });

    it("filter by name", async () => {
        let response = await request(app)
            .get(`/api/items?name=${user1Item.name}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(user1Item._id);
    });

    it("filter by price", async () => {
        let response = await request(app)
            .get(`/api/items?price=${user1Item.price}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(user1Item._id);
        
        response = await request(app)
            .get(`/api/items?priceMin=${user2Item.price}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(user2Item._id);

        response = await request(app)
            .get(`/api/items?priceMax=${user1Item.price}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(user1Item._id);
    });

    it("filter by tags", async () => {
        let response = await request(app)
            .get(`/api/items?tags=${user1Item.tags[0]}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(user1Item._id);
        
        response = await request(app)
            .get(`/api/items?tags=${user1Item.tags[1]}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);

        response = await request(app)
            .get(`/api/items?tags=${user1Item.tags[0]},${user2Item.tags[1]}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it("filter by text", async () => {
        let response = await request(app)
            .get("/api/items?text=test1's")
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(user1Item._id);

        response = await request(app)
            .get("/api/items?text=item")
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it("custom sort", async () => {
        let response = await request(app)
            .get("/api/items?orderBy=price&order=asc")
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0]._id).toBe(user1Item._id);
        expect(response.body[1]._id).toBe(user2Item._id);

        response = await request(app)
            .get("/api/items?orderBy=price&order=desc")
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0]._id).toBe(user2Item._id);
        expect(response.body[1]._id).toBe(user1Item._id);
    });

    it("limit, offset and fields filtering", async () => {
        let response = await request(app)
            .get("/api/items?offset=1&limit=1&fields=name,price")
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(new Set(Object.keys(response.body[0]))).toEqual(new Set(["_id", "name", "price"]));
    });

    it("GET /api/items/:id", async () => {
        let response = await request(app)
            .get(`/api/items/${user1Item._id}`)
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(user1Item._id);
    });
});
