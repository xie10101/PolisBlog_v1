// 在文件顶部添加 "use client"，将该文件标记为客户端组件
'use client'; //
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import SearchModal from '@/app/ui/front/Modal/SearchModal';
import { useState } from 'react';
const TopNavs = () => {
  const router = useRouter();
  // 尝试对导航列表项 进行 对象式渲染 ；
  const navItems = [
    {
      name: '主页',
      icon: faHome,
      path: '/',
    },
    {
      name: '关于我',
      icon: faUser,
      path: '/about',
    },
    {
      name: '知识库问答',
      icon: faSearch,
      path: '/agent',
    },
  ];

  const [isShowSearchModal, setIsShowSearchModal] = useState(false);
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center justify-between">
        {navItems.map(item => {
          return (
            //  是否可以尝试 切换为 link组件
            <Link
              className="mx-3 flex flex-row items-center justify-center transition-all duration-600 hover:bg-gray-200"
              href={item.path}
              key={item.name}
              style={{ width: '100px', height: '40px' }}
            >
              <span className="block text-left">{item.name}</span>
              {/* <FontAwesomeIcon style={{width:"20px",height:"20px" }}  icon={"user"}   /> */}
              <FontAwesomeIcon icon={item.icon} />
            </Link>
          );
        })}
        <button
          className="mx-3 flex flex-row items-center justify-center transition-all duration-600 hover:bg-gray-200"
          style={{ width: '100px', height: '40px' }}
          onClick={() => {
            setIsShowSearchModal(pre => !pre);
          }}
        >
          <span className="mr-1 block text-left">查找</span>
          <FontAwesomeIcon icon={faSearch} />
        </button>
        {/*  设置的onClose 回调用于 在 搜索弹窗 关闭时 进行 状态更新-关联隐现   */}
        <SearchModal
          isShow={isShowSearchModal}
          onClose={() => {
            setIsShowSearchModal(false);
          }}
        ></SearchModal>
      </div>
    </div>
  );
};
export default TopNavs;

/**
 * 记录 -
 *
 */
