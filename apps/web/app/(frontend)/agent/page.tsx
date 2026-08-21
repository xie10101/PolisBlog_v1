'use client';

import React, { useState, useRef, useEffect } from 'react';
import ChatContainer from '@/app/components/agent/ChatContainer';
import MessageList from '@/app/components/agent/MessageList';
import InputBox from '@/app/components/agent/InputBox';
import AgentHeader from '@/app/components/agent/AgentHeader';

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        '你好！我是你的知识库问答助手。我可以帮你查找和分析个人知识库中的内容。请输入你的问题。',
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    // try {
    //   // 调用 API 获取助手回复
    //   const response = await fetch('/api/agent/chat', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ query: content }),
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to get response');
    //   }

    //   const data = await response.json();

    //   const assistantMessage: Message = {
    //     id: (Date.now() + 1).toString(),
    //     type: 'assistant',
    //     content: data.data || '抱歉，我无法生成回复。请稍后重试。',
    //     timestamp: new Date(),
    //   };

    //   setMessages(prev => [...prev, assistantMessage]);
    // } catch (error) {
    //   console.error('Error:', error);
    //   const errorMessage: Message = {
    //     id: (Date.now() + 2).toString(),
    //     type: 'assistant',
    //     content: '发生错误，请检查网络连接后重试。',
    //     timestamp: new Date(),
    //   };
    //   setMessages(prev => [...prev, errorMessage]);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content:
          '你好！我是你的知识库问答助手。我可以帮你查找和分析个人知识库中的内容。请输入你的问题。',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <ChatContainer>
      <AgentHeader onClear={handleClearChat} />
      <MessageList messages={messages} />
      <div ref={messagesEndRef} />
      <InputBox onSendMessage={handleSendMessage} disabled={loading} />
    </ChatContainer>
  );
}
