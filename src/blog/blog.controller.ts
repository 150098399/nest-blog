import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { BlogService } from './blog.service';
import { AuthGuard } from 'src/user/guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('author') author: string,
  ) {
    const res = await this.blogService.findAll(author, keyword);

    return res;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const blog = await this.blogService.findOne(id);
    return blog;
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto, @Request() req) {
    createBlogDto.author = req.user.username; // 临时参数
    const res = await this.blogService.create(createBlogDto);
    return res;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const res = await this.blogService.remove(id);
    return res;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    const res = await this.blogService.update(id, createBlogDto);
    return res;
  }
}
