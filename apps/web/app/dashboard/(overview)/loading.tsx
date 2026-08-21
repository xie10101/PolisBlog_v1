// loading文件- 流式传输 布局

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-t-blue-500"></div>
      <p className="text-xl font-bold">Loading...</p>
      <p className="text-sm text-gray-500">
        Please wait while we load your content.
      </p>
      <p className="text-sm text-gray-500">This may take a few seconds.</p>
      <p className="text-sm text-gray-500">Thank you for your patience.</p>
    </div>
  );
}
