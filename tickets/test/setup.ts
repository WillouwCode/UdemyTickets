import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../tickets/src/app";
import jwt from "jsonwebtoken";

declare global {
    var signin: () => string[];
}

let mongo:any;

beforeAll(async () => {
    jest.setTimeout(30000); // Give it up to 30 seconds to connect
    process.env.JWT_KEY = "testKey";
    process.env.NODE_ENV = "test";

    const mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
},30000);

beforeEach(async () => {
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
    
        for (let collection of collections) {
        await collection.deleteMany({});
        }
    }
},30000);

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
},30000);

global.signin = () => {
    const payload = { 
        email:"test@test.com",
        id:"fakeId" 
    };
    
    const cookie = jwt.sign(payload,process.env.JWT_KEY!)

    const cookieJson = JSON.stringify({jwt: cookie});

    const base64 = Buffer.from(cookieJson).toString("base64");
    return [`session=${base64}`];
}
