import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
//Biblioteca para fazer uma validação pelo "shape"
import * as yup from "yup";
import { AppError } from '../errors/AppError';

class UserController {
    async create(request: Request, response: Response) {
        //desestruturação
        const { name, email } = request.body;

        //Shape de validação
        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        })

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error);
        }

        const usersRepository = getCustomRepository(UsersRepository);

        //Validação de email já cadastrado equivalente à:  select * from users where email = "email"
        const userAlreadyExists = await usersRepository.findOne({
            email
        });
        if (userAlreadyExists) {
            throw new AppError("User already exists!");
        }

        const user = usersRepository.create({
            name,
            email,
        });

        await usersRepository.save(user);

        return response.status(201).json(user);
    }
}

export { UserController };
