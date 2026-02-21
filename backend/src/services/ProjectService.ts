import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const ProjectService = {
  async listAll() {
    return await prisma.project.findMany({ 
      include: { tasks: true } 
    });
  },

  async create(name: string) {
    return await prisma.project.create({ 
      data: { name } 
    });
  },

  async update(id: string, name: string) {
    return await prisma.project.update({
      where: { id },
      data: { name }
    });
  },

  async delete(id: string) {
    // O Prisma lançará erro automaticamente se o ID não existir
    return await prisma.project.delete({ 
      where: { id } 
    });
  }
};