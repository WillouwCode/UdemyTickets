import request from "supertest";
import { app } from "../../../tickets/src/app";

it("returns a 200 on successful signin", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);

    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
});

it("returns a 400 if signin not valid", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(400);
});

it("returns a 400 on incorrect password", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "incorrect"
        })
        .expect(400);
});