'use client';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SubmitHandler } from 'react-hook-form';
import { LoginDto, LoginSchema } from '../../modules/user/dto/login.dto';
import { signIn } from 'next-auth/react';
import useUserInfoStore from '@/store/user';
import { getUserByUserName } from '../../modules/user/user.actions';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
const LoginPage = () => {
  const router = useRouter();
  const setInfo = useUserInfoStore(state => state.setInfo);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginDto>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<LoginDto> = async data => {
    // 1. 调用 Auth.js 登录
    // 设置 redirect: false 以便在客户端处理后续逻辑
    const result = await signIn('credentials', {
      ...data,
      redirect: false,
    });
    // 实际返回是包装对象 - signResponse
    // authorize 返回 null → signIn 返回 { ok: false, error: 'CredentialsSignin' }
    // authorize 返回 user 对象 → signIn 返回 { ok: true, error: null }
    if (result?.error) {
      setError('root', {
        message: '登录失败，请重试',
      });
      return;
    }
    toast.success('登录成功');
    // 2. 登录成功后，获取完整的用户信息并存入 Zustand
    const res = await getUserByUserName(data.username);

    if (res.success && res.data) {
      setInfo({
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        avatar: res.data.avatar,
        bio: res.data.bio,
      });
    }

    if (res.error) toast.error('用户信息获取失败');

    const redirectUrl = searchParams.get('callbackUrl');
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push('/dashboard');
    }
  };
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">登录</CardTitle>
          <CardDescription>请输入您的账号信息以继续</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="hookForm">
            {/* username 字段 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">用户名</label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                {...register('username')}
              />
              {errors.username && (
                <span className="errorMessage">{errors.username.message}</span>
              )}
            </div>

            {/* Password 字段 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">密码</label>
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

            {/* 提交按钮 */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? '提交中...' : '登录'}
            </Button>
            {/*表单提交的整体性错误 - 可能不属于某个表单字段 */}

            {errors.root && (
              <span className="errorMessage">{errors.root.message}</span>
            )}
          </form>
          <div className="text-muted-foreground mt-4 text-center text-sm">
            还没有账号？{' '}
            <Button
              variant="link"
              className="p-0"
              onClick={() => router.push('/register')}
            >
              立即注册
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
