import request from "supertest";
import { app } from "../../src/app";
import { Ticket } from "../../src/models/ticket";

it("has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({});

    expect(response.status).not.toBe(404);
});

it("can only be accessed if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({})
        .expect(401);
});

it("returns a success if the user is signed in", async () => {
    const cookie = global.signin();
    
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({});

    expect(response.status).not.toBe(401);
});

it("returns an error if an invalid title is provided", async () => {
    const cookie = global.signin();
    
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 10
        })
        .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
    const cookie = global.signin();
    
    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "something",
            price: -10
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "something"
        })
        .expect(400);

     await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "something",
            price: null
        })
        .expect(400);
});

it("creates a ticket with valid price and title", async () => {
    let tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0);
    
    const cookie = global.signin();
    
    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "something",
            price: 10.0
        })
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
});