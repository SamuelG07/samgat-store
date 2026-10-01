import { categoryRepository } from '../repositories/categoryRepository';
import { AppError } from '../utils/errorHandler';
import { generateSlug } from '../utils/slug';

export class CategoryService {
  async findAll() {
    return categoryRepository.findAll();
  }

  async findById(id: number) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError({ message: 'Categoria não encontrada', statusCode: 404 });
    }
    return category;
  }

  async create(data: any) {
    const slug = data.slug || generateSlug(data.name);
    if (await categoryRepository.slugExists(slug)) {
      throw new AppError({ message: 'Slug já está em uso', statusCode: 409 });
    }
    return categoryRepository.create({ name: data.name, slug, description: data.description || null });
  }

  async update(id: number, data: any) {
    await this.findById(id);
    const slug = data.slug || (data.name ? generateSlug(data.name) : undefined);
    if (slug && await categoryRepository.slugExists(slug, id)) {
      throw new AppError({ message: 'Slug já está em uso', statusCode: 409 });
    }
    return categoryRepository.update(id, { name: data.name, slug, description: data.description || null });
  }

  async delete(id: number) {
    await this.findById(id);
    return categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
