import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";

import createConnection from '../database';

describe("Surveys", () => {
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

    it("Should be able to create a new survey", async () => {
        const response = await request(app).post("/surveys")
            .send({
                title: "Pesquisa de satisfação",
                description: "De 0 a 10 qual a chance de você indicar esta aplicação?"
            });
        expect(response.status).toBe(201);
        //Pode-se inserir mais de um expect
        expect(response.body).toHaveProperty("id");
    });

    it("Should be able to get all surveys", async () => {
        await request(app).post("/surveys")
            .send({
                title: "Nova Pesquisa teste",
                description: "De 0 a 10 qual nota você dá para este teste?"
            });
        const response = await request(app).get("/surveys");
        expect(response.body.length).toBe(2);
    });

})