import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, getManager, Repository } from 'typeorm';

import {
  CategoryCanNotDoMagicError,
  CategoryDoesNotExistError,
} from '../common/errors/errors';
import { sleep } from '../utils/sleep';

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

  public async veryRealisticMethod(id: string): Promise<Category> {
    return await getManager().transaction(async (manager) => {
      const category = await this.findOneByIdAndLock(id, manager);
      if (!category) {
        throw new CategoryDoesNotExistError();
      }
      if (!category.canDoMagic) {
        throw new CategoryCanNotDoMagicError();
      }

      await sleep(1000);

      await this.getRepository(manager).update(id, { canDoMagic: false });

      return this.findOneByIdOrFail(id);
    });
  }

  private async findOneByIdAndLock(
    id: string,
    manager: EntityManager,
  ): Promise<Category> {
    return this.getRepository(manager).findOne(id, {
      lock: { mode: 'pessimistic_write' },
    });
  }

  private getRepository(
    manager: EntityManager | undefined,
  ): Repository<Category> {
    return manager ? manager.getRepository(Category) : this.categoriesRepo;
  }
}
