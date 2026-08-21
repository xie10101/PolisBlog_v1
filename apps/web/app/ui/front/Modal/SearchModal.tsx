'use client';

import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import {
  faSearch,
  faTimesCircle,
  faFrown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchItem from './SearchItem';
import useDebounce from '@/app/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
// import { searchPostsByTitle } from '@/modules/post/post.actions';
type SearchItemProps = {
  isShow: boolean;
  onClose?: () => void;
};

const SearchModal = (props: SearchItemProps) => {
  //  为 onClose 设置默认值
  // 1. 创建一个 root 节点，用于挂载 Portal
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedValue = useDebounce(inputValue, 500);
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  // 2. 水合完成后才读取真实 DOM
  useEffect(() => {
    setRoot(document.getElementById('modal-root') as HTMLElement);
  }, []);
  // useEffect(() => {
  //   const searchHandler = async () => {
  //     const res = await searchPostsByTitle(debouncedValue);
  //     if (res.success && res.data) {
  //       setResults(res.data);
  //     }
  //   };
  //   if (debouncedValue.trim() !== '') {
  //     searchHandler();
  //   } else {
  //     setResults([]);
  //   }

  //   // const filtered = data.filter((item: any) => {
  //   //   //  对于空白字符串的处理
  //   //   if (item.title === undefined) return false;
  //   //   return item.title
  //   //     .toLowerCase()
  //   //     .includes(debouncedValue.toLowerCase());
  //   // });
  //   // setResults(filtered);
  //   // });
  // }, [debouncedValue]);

  if (!root) return null; // 提前中断无法挂载 AnimatePresence

  return ReactDOM.createPortal(
    //  react - 中 设置 传送们 -实现 - 遮罩层
    // 添加过渡效果
    <AnimatePresence>
      {props.isShow ? (
        <motion.div key="box" exit={{ opacity: 0 }}>
          <div
            className="z-40 flex h-screen w-screen flex-col items-center justify-center"
            style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          >
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <div className="flex h-150 w-150 flex-col rounded-t-md bg-white shadow-md">
                <header className="flex h-10 items-center justify-between rounded-t-md bg-gray-200 p-2">
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{
                      fontSize: '15px',
                      color: '#999999',
                      marginRight: '5px',
                    }}
                  />
                  {/*  添加防抖  */}
                  <input
                    type="text"
                    className="flex-1 focus:outline-none"
                    placeholder="……"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                  />
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    style={{ fontSize: '18px', color: '#999999' }}
                    onClick={() => {
                      setInputValue('');
                      props.onClose?.();
                    }}
                  />
                </header>

                {debouncedValue === '' ? (
                  <div className="flex h-140 w-full items-center justify-center">
                    <FontAwesomeIcon
                      icon={faSearch}
                      style={{
                        fontSize: '150px',
                        color: 'rgba(0,0,0,0.1)',
                        width: '150px',
                      }}
                    ></FontAwesomeIcon>
                  </div>
                ) : results.length === 0 ? (
                  <div className="flex h-140 w-full items-center justify-center">
                    <FontAwesomeIcon
                      icon={faFrown}
                      style={{ fontSize: '150px', color: 'rgba(0,0,0,0.1)' }}
                    ></FontAwesomeIcon>
                  </div>
                ) : (
                  <>
                    <div className="toptip">
                      <div className="w-full border-b border-dashed border-gray-200 p-2 text-sm">
                        找到
                        <span className="mr-1 ml-1 inline-block">
                          {results.length}
                        </span>
                        条搜索结果
                      </div>
                    </div>
                    <main className="w-full flex-1 overflow-y-auto">
                      <ul>
                        {results.map((item, index) => {
                          return (
                            <SearchItem
                              key={index}
                              item={item}
                              onClick={() => {
                                router.push(`/${item.slug}`);
                                props.onClose?.();
                              }}
                            ></SearchItem>
                          );
                        })}
                      </ul>
                    </main>
                  </>
                )}
              </div>
            </motion.button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,

    root as HTMLElement,
  );
};
{
  /*  待自适应适配  */
}

//  设置 一个搜索反馈处理 ：

export default SearchModal;
