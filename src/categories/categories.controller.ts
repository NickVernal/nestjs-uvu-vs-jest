import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthStrategy } from '../constants';
import { ApiKeyGuard } from '../auth/strategies/api-key/api-key.guard';
import { routes } from '../routes';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryRequestData,
  CreateCategoryResponse,
} from './dto/create.dto';
import {
  DeleteCategoryRequestParams,
  DeleteCategoryResponse,
} from './dto/delete.dto';
import { MagicRequestParams, MagicResponse } from './dto/magic.dto';
import { ReceiveManyResponse } from './dto/receive-many.dto';
import {
  ReceiveOneRequestParams,
  ReceiveOneResponse,
} from './dto/receive-one.dto';
import {
  UpdateCategoryRequestData,
  UpdateCategoryRequestParams,
  UpdateCategoryResponse,
} from './dto/update.dto';

@ApiTags('Categories')
@Controller(routes.root)
@UseGuards(ApiKeyGuard)
@ApiBearerAuth(AuthStrategy.ApiKey)
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get(routes.categories.receiveOne)
  @ApiOperation({
    operationId: 'receiveOneCategory',
    description: 'API: Receive category by ID',
  })
  @ApiOkResponse({ type: ReceiveOneResponse })
  public async receiveOneCategory(
    @Param() { id }: ReceiveOneRequestParams,
  ): Promise<ReceiveOneResponse> {
    const payload = await this.service.findOneByIdOrFail(id);
    return { status: 'ok', payload };
  }

  @Get(routes.categories.receiveMany)
  @ApiOperation({
    operationId: 'receiveManyCategories',
    description: 'API: Receive many categories',
  })
  @ApiOkResponse({ type: ReceiveManyResponse })
  public async receiveManyCategories(): Promise<ReceiveManyResponse> {
    const payload = await this.service.findAll();
    return { status: 'ok', payload };
  }

  @Post(routes.categories.create)
  @ApiOperation({
    operationId: 'createCategory',
    description: 'API: Create category',
  })
  @ApiOkResponse({ type: CreateCategoryResponse })
  public async createCategory(
    @Body() data: CreateCategoryRequestData,
  ): Promise<CreateCategoryResponse> {
    const payload = await this.service.createCategory(data);
    return {
      status: 'ok',
      payload,
    };
  }

  @Patch(routes.categories.update)
  @ApiOperation({
    operationId: 'updateCategory',
    description: 'API: Update category',
  })
  @ApiOkResponse({ type: UpdateCategoryResponse })
  public async updateCategory(
    @Param() { id }: UpdateCategoryRequestParams,
    @Body() data: UpdateCategoryRequestData,
  ): Promise<UpdateCategoryResponse> {
    const payload = await this.service.updateCategory(id, data);
    return { status: 'ok', payload };
  }

  @Delete(routes.categories.delete)
  @ApiOperation({
    operationId: 'deleteCategory',
    description: 'API: Delete category',
  })
  @ApiOkResponse({ type: DeleteCategoryResponse })
  public async deleteCategory(
    @Param() { id }: DeleteCategoryRequestParams,
  ): Promise<DeleteCategoryResponse> {
    await this.service.deleteCategory(id);
    return { status: 'ok' };
  }

  @Post(routes.categories.magic)
  @ApiOperation({
    operationId: 'categoryMagic',
    description: 'API: abracadabra',
  })
  @ApiOkResponse({ type: MagicResponse })
  public async magicCategory(
    @Param() { id }: MagicRequestParams,
  ): Promise<MagicResponse> {
    const payload = await this.service.veryRealisticMethod(id);
    return { status: 'ok', payload };
  }
}
