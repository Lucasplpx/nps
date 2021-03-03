import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRespository';
import * as Yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const schema = Yup.object().shape({
      name: Yup.string().required('Nome é obrigatorio'),
      email: Yup.string().email().required('Email é obrigatorio'),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({
      email,
    });

    if (userAlreadyExists) {
      throw new AppError('User already exists!');
    }

    const user = usersRepository.create({
      name,
      email,
    });

    await usersRepository.save(user);

    return res.status(201).json(user);
  }
}

export { UserController };
