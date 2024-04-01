import { Module, forwardRef } from '@nestjs/common';
import { ItemController } from './items.controller';
import { ViewItemsService } from './services/view-items.service';
import { CreateItemsService } from './services/create-items.service';
import { DeleteItemsService } from './services/delete-items.service';
import { UpdateItemsService } from './services/update-item.service';
import { AppModule } from 'src/app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [
    ViewItemsService,
    UpdateItemsService,
    CreateItemsService,
    DeleteItemsService,
  ],
  exports: [
    ViewItemsService,
    UpdateItemsService,
    CreateItemsService,
    DeleteItemsService,
  ],
  controllers: [ItemController],
})
export class ItemsModule {}
