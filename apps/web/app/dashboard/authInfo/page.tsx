import { AuthInfoForm } from './AuthInfoForm';

export default function AuthInfoPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">个人信息管理</h1>
        <p className="mt-1 text-gray-600">编辑和管理你的博客个人信息</p>
      </div>
      <AuthInfoForm />
    </div>
  );
}
