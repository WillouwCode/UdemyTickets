import request from "supertest";
import { app } from "../../../tickets/src/app";

it("returns a 201 on successful signup", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
});

it("sets a cookie on successful signup", async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
});

it("returns a 400 with invalid email", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "testtest.com",
            password: "password"
        })
        .expect(400);
});


it("returns a 400 on with invalid password", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "pas"
        })
        .expect(400);
});

it("Disallow duplicate email", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(400);
});