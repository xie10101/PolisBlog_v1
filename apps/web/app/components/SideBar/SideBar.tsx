'use client';
import React from 'react';
import DrawerNoMask from '@/app/ui/front/Drawer/DrawerNoMask';
import Statistics from './Statistics';
import { Calendar } from '@/app/components/ui/calendar';
import { da } from 'date-fns/locale';
const SideBar = (props: { className: string }) => {
  const arr = [1, 7, 8, 9, 10];
  return (
    <div className={props.className}>
      <DrawerNoMask show={true}>
        <div className="flex h-full w-full flex-col items-center justify-center text-white">
          <div className="flex h-1/2 flex-col items-center gap-2">
            <img
              src="/images/profile.png"
              className="mt-10 h-24 w-24 rounded-full transition-all duration-600 hover:rotate-360"
              alt="头像"
            />
            <h4> 张三 </h4>
            <p className="text-[#b8b5bc]"> 个性标签 </p>
            {/* 博客数据块 */}
            <Statistics />
            <div className="flex w-full flex-wrap items-center justify-center">
              {arr.map(item => {
                return (
                  <div
                    key={item}
                    className="flex items-center justify-center gap-1"
                    style={{ width: '5rem' }}
                  >
                    <p className="h-1 w-1 rounded-full bg-[#9de8f7]"> </p>
                    <a
                      href="https://www.baidu.com"
                      className="box-border text-gray-400 hover:text-[#e7e9e9]"
                      target="_blank"
                    >
                      xiaomi
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex h-1/2 flex-col items-center justify-center">
            <div className="flex h-1/2 flex-col items-center justify-center"></div>
          </div>
        </div>
      </DrawerNoMask>
    </div>
  );
};
export default SideBar;
