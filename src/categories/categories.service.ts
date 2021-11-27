import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDoesNotExistError } from '../common/errors/errors';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { CreateCategoryRequestData } from './dto/create.dto';
import { UpdateCategoryRequestData } from './dto/update.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
  ) {}

  public async createCategory(
    data: CreateCategoryRequestData,
  ): Promise<Category> {
    return this.categoriesRepo.save(data);
  }

  public async updateCategory(
    id: string,
    data: UpdateCategoryRequestData,
  ): Promise<Category> {
    await this.categoriesRepo.update(id, data);
    return this.findOneByIdOrFail(id);
  }

  public async deleteCategory(id: string): Promise<void> {
    await this.categoriesRepo.delete(id);
  }

  public async findOneByIdOrFail(id: string): Promise<Category> {
    const category = await this.categoriesRepo.findOne(id);
    if (!category) {
      throw new CategoryDoesNotExistError();
    }
    return category;
  }

  public async findAll(): Promise<Category[]> {
    return this.categoriesRepo.find();
  }
}
