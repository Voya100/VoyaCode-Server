import { callback } from '@api/auth/jwt.strategy';
import { BlogEntity } from '@api/blogs/blog.entity';
import {
  AddBlogDto,
  BlogIdParamDto,
  GetBlogsDto,
  PreviewBlogDto
} from '@api/blogs/blogs.dtos';
import { BlogResult } from '@api/blogs/blogs.interfaces';
import { BlogsService } from '@api/blogs/blogs.service';
import { EntityNotFoundFilter } from '@common/exception-filters/entity-not-found-exception.filter';
import { DataFormatter } from '@common/helpers/data-formatter';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/blogs')
export class BlogsController {
  constructor(private blogs: BlogsService) {}

  static formatBlogResult(blog: BlogEntity): BlogResult {
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
  static formatBlogResults(blogs: BlogEntity[]): BlogResult[] {
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
  @UseFilters(new EntityNotFoundFilter('Blog does not exist.'))
  async getBlog(@Param() { id }: BlogIdParamDto) {
    const blog = await this.blogs.getBlog(id);
    return {
      data: BlogsController.formatBlogResult(blog)
    };
  }

  // Returns blog without tag -> Html conversion
  @Get('raw/:id')
  @UseFilters(new EntityNotFoundFilter('Blog does not exist.'))
  async getRawBlog(@Param() { id }: BlogIdParamDto) {
    const blog = await this.blogs.getBlog(id);
    return {
      data: blog
    };
  }

  @Post()
  @UseGuards(AuthGuard('jwt', { callback }))
  async addBlog(@Body() { name, text }: AddBlogDto) {
    const blog = await this.blogs.addBlog(name, text);
    return {
      message: 'Blog added successfully.',
      data: blog
    };
  }

  // Returns formatted version of the blog
  @Post('preview')
  async previewBlog(@Body()
  {
    name,
    text,
    id = 1,
    date = new Date()
  }: PreviewBlogDto) {
    return { data: BlogsController.formatBlogResult({ id, name, text, date }) };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt', { callback }))
  @UseFilters(new EntityNotFoundFilter('Blog does not exist.'))
  async editBlog(
    @Param() { id }: BlogIdParamDto,
    @Body() { name, text }: AddBlogDto
  ) {
    const blog = await this.blogs.editBlog(id, name, text);
    return {
      message: 'Blog edited successfully.',
      data: blog
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt', { callback }))
  @UseFilters(new EntityNotFoundFilter('Blog does not exist.'))
  async deleteBlog(@Param() { id }: BlogIdParamDto) {
    await this.blogs.deleteBlog(id);
    return {
      message: 'Blog deleted successfully.'
    };
  }
}
