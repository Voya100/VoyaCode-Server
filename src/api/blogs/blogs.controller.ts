import { BlogResult } from '@api/blogs/blogs.interfaces';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { DataFormatter } from '../../common/helpers/data-formatter';
import { Blog } from './blog.entity';
import { AddBlogDto, BlogIdParamDto, GetBlogsDto } from './blogs.dtos';
import { BlogsService } from './blogs.service';

@Controller('api/blogs')
export class BlogsController {
  constructor(private blogs: BlogsService) {}

  static formatBlogResult(blog: Blog): BlogResult {
    return {
      id: blog.id,
      name: blog.name,
      // Note: Blogs can be submitted only by the website admin
      // Possible Html in text is not removed
      text: DataFormatter.tagsToHtml(blog.text),
      date: DataFormatter.formatDate(blog.date),
      year: blog.date.getFullYear()
    };
  }
  static formatBlogResults(blogs: Blog[]): BlogResult[] {
    return blogs.map(BlogsController.formatBlogResult);
  }

  @Get()
  async getBlogs(@Query() { limit }: GetBlogsDto) {
    const blogs = await this.blogs.getBlogs({ limit });
    return {
      data: BlogsController.formatBlogResults(blogs)
    };
  }

  @Get(':id')
  async getBlog(@Param() { id }: BlogIdParamDto) {
    const blog = await this.blogs.getBlog(id);
    return {
      data: BlogsController.formatBlogResult(blog)
    };
  }

  @Post()
  async addBlog(@Body() { name, text }: AddBlogDto) {
    const blog = await this.blogs.addBlog(name, text);
    return {
      message: 'Blog added successfully.',
      data: blog
    };
  }

  @Put(':id')
  async editBlog(
    @Param() { id }: BlogIdParamDto,
    @Body() { name, text }: AddBlogDto
  ) {
    const blog = await this.blogs.editBlog(id, name, text);
    return {
      message: 'Blog added successfully.',
      data: blog
    };
  }

  @Delete(':id')
  async deleteBlog(@Param() { id }: BlogIdParamDto) {
    await this.blogs.deleteBlog(id);
    return {
      message: 'Blog deleted successfully.'
    };
  }
}
