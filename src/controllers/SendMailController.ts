import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailsService from "../services/SendMailsService";

class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({ email });

        if (!user) {
            throw new AppError("Users does not exists!");            
        }

        const survey = await surveysRepository.findOne({ id: survey_id });

        if (!survey) {
            throw new AppError("Survey does not exists!");            
        }
        //Passando o caminho do arquivo de estilização do template
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: { user_id: user.id, value: null, survey_id: survey_id  },
            relations: ["user", "survey"]
        });
        if (surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id;
            await SendMailsService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        //Salvando as informações na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id,
        });

        await surveysUsersRepository.save(surveyUser);
        variables.id = surveyUser.id;
        //Enviar e-mail para o usuário
        await SendMailsService.execute(email, survey.title, variables, npsPath);
        return response.json(surveyUser);
    }
}

export { SendMailController }