import { apiHandler } from '@/lib/api-handler';
import { NextRequest } from 'next/server';

/**
 * POST /api/agent/chat
 * 处理知识库问答请求
 */
export const POST = apiHandler(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      throw new Error('Invalid query parameter');
    }

    // TODO: 集成 RAG (检索增强生成) 实现
    // 1. 从知识库搜索相关文档
    // 2. 使用 LLM 基于检索结果生成回复

    // 临时模拟回复
    const response = await mockAgentResponse(query);

    return response;
  } catch (error) {
    throw error;
  }
});

/**
 * 模拟助手回复（临时方案）
 * 后续应替换为真实的 RAG 实现
 */
async function mockAgentResponse(query: string): Promise<string> {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 简单的关键字匹配回复逻辑
  const queryLower = query.toLowerCase();

  if (queryLower.includes('hello') || queryLower.includes('hi')) {
    return '你好！很高兴认识你。我可以帮助你查询知识库中的内容。请告诉我你想了解什么？';
  }

  if (queryLower.includes('react') || queryLower.includes('javascript')) {
    return '关于 React 和 JavaScript：这是前端开发中的重要技术。React 是一个用于构建用户界面的库，JavaScript 是它的基础语言。你想了解哪个具体的话题呢？';
  }

  if (queryLower.includes('database') || queryLower.includes('数据库')) {
    return '数据库是用于存储和管理数据的系统。常见的数据库类型包括关系型数据库（如 PostgreSQL）和非关系型数据库（如 MongoDB）。你需要了解哪种类型的数据库？';
  }

  return `感谢你的问题："${query}"。我已经在知识库中搜索了相关内容。根据现有的文档，这是一个有趣的话题。建议你查阅相关的文档或技术文章以获得更详细的信息。`;
}
