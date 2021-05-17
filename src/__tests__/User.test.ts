import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";

import createConnection from '../database';

describe("Users", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    //Removendo os dados no database
    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to create a new user", async () => {
        const response = await request(app).post("/users")
            .send({
                email: "natasharomanoff@teste.com",
                name: "Natasha Romanoff"
            });
        expect(response.status).toBe(201);
    });

    it("Should not be able to create a user with exists email", async () => {
        const response = await request(app).post("/users")
            .send({
                email: "natasharomanoff@teste.com",
                name: "Natasha Romanoff"
            });
        expect(response.status).toBe(400);
    });
})