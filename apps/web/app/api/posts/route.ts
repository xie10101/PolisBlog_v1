import { NextResponse } from 'next/server';
import { PostRepository } from '@/modules/post/post.server';

/**
 * 处理 GET 请求，获取所有文章
 */
export async function GET(request: Request) {
  try {
    const posts = await PostRepository.findAll();
    // 使用 NextResponse.json 来返回 JSON 数据
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    // 处理错误情况
    return NextResponse.json(
      { success: false, error: '获取文章失败' },
      { status: 500 },
    );
  }
}

/**
 * 处理 POST 请求，创建新文章
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 在这里可以使用 Zod 对 body 进行校验

    const newPost = await PostRepository.create(body);

    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '创建文章失败' },
      { status: 500 },
    );
  }
}
