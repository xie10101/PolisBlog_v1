'use client';
import Image from 'next/image';
import useUserInfoStore from '@/store/user';
// 用户信息的基础类型定义
export type User = {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
};

export function User() {

  const userInfo = useUserInfoStore();
  console.log('UserInfo from Zustand:', userInfo); // 调试输出
  return (
    <>
      <div className="flex h-full w-full items-center">
        {/*  用一个头像占位符替代  */}
        <Image
          src={userInfo?.avatar || '/globe.svg'}
          width={30}
          height={40}
          alt="avatar"
          className="rounded-full"
        />
        <div className="ml-2 flex flex-col justify-center">
          <h2 className="text-l font-bold">{userInfo?.username || 'User'}</h2>
          <p className="text-[12px] text-gray-500">
            {userInfo?.email || 'Email not available'}
          </p>
        </div>
      </div>
    </>
  );
}
