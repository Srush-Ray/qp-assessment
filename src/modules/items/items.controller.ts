import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryPaginatedParamsDto } from 'src/common/dto/request.dto';
import { PaginatedResult } from 'src/common/dto/response.dto';
import { adminAuthGuard } from 'src/common/middleware/auth-gaurd';
import { ViewItemsService } from './services/view-items.service';
import { ItemDto, UpdateItemDto } from './dto/create-item.dto';
import { DeleteItemsService } from './services/delete-items.service';
import { CreateItemsService } from './services/create-items.service';
import { UpdateItemsService } from './services/update-item.service';
import { ApiTags } from '@nestjs/swagger';
import { ViewItemDto } from './dto/view-item.dto';

@ApiTags('item')
@Controller('/v1/item')
export class ItemController {
  constructor(
    private readonly viewItemService: ViewItemsService,
    private readonly createItemService: CreateItemsService,
    private readonly deleteItemService: DeleteItemsService,
    private readonly updateItemService: UpdateItemsService,
  ) {}

  @Get(`/all`)
  async viewAllItems(
    @Query() query?: QueryPaginatedParamsDto,
  ): Promise<PaginatedResult<ViewItemDto>> {
    return await this.viewItemService.viewAllItems({
      limit: query?.limit,
      page: query?.page,
    });
  }

  @Get(`/:id`)
  async viewItemById(
    @Param() id?: string,
  ): Promise<ViewItemDto | { message: string }> {
    return await this.viewItemService.viewItemById({
      id,
    });
  }

  @Delete(`/:id`)
  @UseGuards(adminAuthGuard)
  async deleteItemById(@Param() id?: string): Promise<{ message: string }> {
    return await this.deleteItemService.deleteItemById({ id });
  }

  @Post(`/`)
  @UseGuards(adminAuthGuard)
  async createItems(@Body() itemDetails: ItemDto): Promise<ItemDto> {
    return await this.createItemService.createItem({ itemDetails });
  }

  @Patch(`/:id`)
  @UseGuards(adminAuthGuard)
  async updateItems(
    @Body() itemDetails: UpdateItemDto,
    @Param() id: string,
  ): Promise<{ message: string }> {
    return await this.updateItemService.updateItemById({
      itemDetails,
      id,
    });
  }
}
