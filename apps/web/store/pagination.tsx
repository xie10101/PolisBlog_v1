import { create } from "zustand";

type TotalPageNumStore = {
      totalPageNum: number;
      setTotalPageNum: (totalPageNum: number) => void;
};
 const  useTotalPageNumStore = create<TotalPageNumStore>((set) => ({
      totalPageNum: 0, // 针对抽屉折叠的设置 
      setTotalPageNum: (totalPageNum: number) => set({ totalPageNum }),
}));

export default useTotalPageNumStore; 
