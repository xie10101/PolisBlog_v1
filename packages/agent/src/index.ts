/**
 * 知识库问答 Agent（占位实现）。
 *
 * TODO(实现阶段): 接入 langchainjs 完整链路 ——
 *   文档加载 → 文本分块 → Embedding → 向量库检索 → 检索结果注入上下文 → LLM 生成。
 *
 * 依赖已在 package.json 声明（langchain / @langchain/core / @langchain/openai），
 * 待真正实现时再引入具体类型（如 BaseChatModel）与调用逻辑。
 */

export interface QaAgentOptions {
  /** 底层聊天模型实例（实现阶段替换为 langchain 的 BaseChatModel） */
  model: unknown;
  /** 系统提示词 */
  systemPrompt?: string;
}

export interface QaResult {
  answer: string;
  /** 命中的知识库来源 */
  sources: string[];
}

export interface QaAgent {
  ask(question: string): Promise<QaResult>;
}

export function createQaAgent(options: QaAgentOptions): QaAgent {
  const systemPrompt = options.systemPrompt ?? "你是一个个人知识库问答助手，请基于提供的资料回答。";

  return {
    async ask(_question: string): Promise<QaResult> {
      // TODO: 先做向量检索，把命中的资料片段拼入上下文，再调用模型生成回答。
      void systemPrompt;
      return { answer: "（占位）知识库问答能力待实现", sources: [] };
    },
  };
}
