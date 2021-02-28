import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
    /**
     * O cálculo do NPS funciona da seguinte forma:
     * Desconsideramos os neutros (notas 7 e 8) nas notas, mas contam na quantidade de respondentes
     * (numero de promotores - numero de detratores) / (numero de respondentes) * 100
     */
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull()),
        });

        const detractor = surveysUsers.filter(
            (survey) => survey.value >= 0 && survey.value <= 6
        ).length;

        const promoters = surveysUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length;

        const passive = surveysUsers.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
        ).length;

        const totalAnswers = surveysUsers.length;

        const calculate = ((promoters - detractor) / totalAnswers) * 100;
        Number(calculate).toFixed(2);

        return response.json({
            detractor,
            promoters,
            passive,
            totalAnswers,
            nps: calculate,
        });
    }
}

export { NpsController };