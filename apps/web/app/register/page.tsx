'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RegisterSchema, registerDto } from '../../modules/user/dto/register.dto';
import { RegisterHandler } from '../../modules/user/user.actions';
import { toast } from 'sonner';

// 前端共享类型 
export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<registerDto>({
    defaultValues: {
      username: '',
      password: '',
      email: '',
      confirmPassword: '',
    },
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit: SubmitHandler<registerDto> = async data => {
    const result = await RegisterHandler(data);
    if (result.success) {
      toast.success(result.data?.message || '注册成功');
      router.push('/login');
    } else {
      toast(result.error);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">注册账号</CardTitle>
          <CardDescription>创建一个新账号以开始使用</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="hookForm">
            {/* username 字段 */}
            {/* <div className='formGroup'> */}
            <label htmlFor="username" className="text-sm font-medium">
              用户名
            </label>
            <Input
              id="username"
              type="text"
              placeholder="请输入用户名"
              {...register('username')}
            />
            {errors.username && (
              <span className="errorMessage">{errors.username.message}</span>
            )}
            {/* Email 字段 */}
            <div className="formGroup">
              <label htmlFor="email" className="text-sm font-medium">
                邮箱
              </label>
              <Input
                id="email"
                type="email"
                placeholder="请输入邮箱"
                {...register('email')}
              />
              {errors.email && (
                <span className="errorMessage">{errors.email.message}</span>
              )}
            </div>

            {/* Password 字段 */}
            <div className="formGroup">
              <label htmlFor="password" className="text-sm font-medium">
                密码
              </label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                {...register('password')}
              />
              {errors.password && (
                <span className="errorMessage">{errors.password.message}</span>
              )}
            </div>

            {/* 确认密码字段 */}
            <div className="formGroup">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                确认密码
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <span className="errorMessage">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* 提交按钮 */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? '提交中...' : '注册'}
            </Button>

            {/* 表单提交的整体性错误 */}
            {errors.root && <span className="">{errors.root.message}</span>}
          </form>
          <div className="text-muted-foreground mt-4 text-center text-sm">
            已有账号？{' '}
            <Button
              variant="link"
              className="p-0"
              onClick={() => router.push('/login')}
            >
              立即登录
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
