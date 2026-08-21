import React from 'react';

interface ChatContainerProps {
  children: React.ReactNode;
}

export default function ChatContainer({ children }: ChatContainerProps) {
  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
