import request from "supertest";
import { app } from "../../src/app";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
    const testId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${testId}`)
        .send()
        .expect(404);
});

it("returns a ticket if the ticket is found", async () => {        
    const createResponse = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "something",
            price: 10.0
        })
        .expect(201);
    
    await request(app)
        .get(`/api/tickets/${createResponse.body.id}`)
        .send()
        .expect(200);
});