import React from 'react';
import { Message } from '@/app/(frontend)/agent/page';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`group max-w-xs rounded-lg px-4 py-2 sm:max-w-md md:max-w-lg lg:max-w-2xl ${
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="text-sm leading-relaxed">{message.content}</div>
        <div
          className={`mt-1 flex items-center justify-between gap-2 text-xs ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          <span>{message.timestamp.toLocaleTimeString('zh-CN')}</span>
          {!isUser && (
            <button
              onClick={handleCopy}
              className="opacity-0 transition-opacity group-hover:opacity-100"
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
