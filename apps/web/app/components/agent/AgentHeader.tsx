import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Trash2, Settings } from 'lucide-react';

interface AgentHeaderProps {
  onClear?: () => void;
}

export default function AgentHeader({ onClear }: AgentHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-2">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">知识库问答助手</h1>
            <p className="text-sm text-gray-500">AI驱动的个人知识库问答系统</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-gray-600 hover:text-gray-900"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
