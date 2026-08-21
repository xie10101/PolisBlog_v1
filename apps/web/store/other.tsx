//  针对 渲染 或者 简单 尝试性处理
import { create } from "zustand";
type LayoutStore = {
      showDrawer: boolean;
      toggle: () => void;
}; 
const   useLayoutStore = create<LayoutStore>((set) => ({
      showDrawer: true, // 针对抽屉折叠的设置 
      toggle: () => set((state) => ({ showDrawer: !state.showDrawer })),    
}));


export  default useLayoutStore;
