import { Controller, Get, Body, Query, Put, Param } from '@nestjs/common';

import { PaginationDto } from 'src/domain/dto/pagination.dto';
import { PostsProcessorService } from './posts-processor.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsWithFilters } from './dto/get-posts-filters.dto';

@Controller('posts')
export class PostProcessorController {
  constructor(private readonly postService: PostsProcessorService) {}

  @Get()
  async getPosts(@Query() request: GetPostsWithFilters) {
    const data = await this.postService.getPaginatedPosts(request);

    return { data };
  }

  @Get('/stats')
  async getStats() {
    const data = await this.postService.getPostsStats();

    return { data };
  }

  @Get('/operations')
  async getPostsOperations(@Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const data = await this.postService.getPaginatedPostsOperations(
      limit,
      page,
    );

    return { data };
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const data = await this.postService.updatePost({ id, ...updatePostDto });

    console.log(data);

    return { data };
  }
}
