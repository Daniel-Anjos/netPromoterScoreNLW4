import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveysController {
    async create(request: Request, response: Response) {
        const { title, description } = request.body;

        const surveysRepository = getCustomRepository(SurveysRepository);

        const survey = surveysRepository.create({
            title,
            description
        });

        await surveysRepository.save(survey);

        return response.status(201).json(survey);
    }
    async show(request: Request, response: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository);
        const all = await surveysRepository.find();

        return response.json(all);
    }
    async remove(request: Request, response: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository);
        const { survey_id } = request.params;
        
        const surveyNotExists = await surveysRepository.findOne({
            id: survey_id
        });

        if (! surveyNotExists) {
            throw new AppError("Search not exists!");
        }else{
            const remove = await surveysRepository.delete({
                id: survey_id
            })
            return response.status(201).json("Search deleted successfully");
        }

           

        
        
    }
}

export { SurveysController }