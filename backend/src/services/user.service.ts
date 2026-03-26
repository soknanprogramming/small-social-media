import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { RegisterInput } from '../validations/user.validation';

export const createUser = async (data: RegisterInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
