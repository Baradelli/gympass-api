import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface IRequest {
  password: string
  name: string
  email: string
}

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: IRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

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
