import type { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface IRequest {
  password: string
  name: string
  email: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: IRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('E-mail already exist')
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
