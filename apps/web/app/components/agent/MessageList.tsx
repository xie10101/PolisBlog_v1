import React from 'react';
import { Message } from '@/app/(frontend)/agent/page';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="space-y-4">
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
