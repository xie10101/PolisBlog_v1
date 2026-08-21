export default function Title() {
// 实现博客网站的网站主名的部分  
    return (
    <div className="flex  flex-col items-center justify-center">
     <a href="#">
        <i className="bg-black translate-x-1/10" style={{height:"2px",width:"80%",display:"block",}}></i>
         <h1 className="text-6xl font-bold">XIEX</h1> 
        <i className="bg-black translate-x-1/10" style={{height:"2px",width:"80%",display:"block"}}></i>
     </a>
    </div>
  );
} 


/**
 * 
 * 熟悉工具类 ：
 * transfrom : 用于元素的2D或3D转换。
 * transfrrm: translateX() 用于从其当前位置移动元素。
 * translateX(100px) : 将元素向右移动100像素。
 * translateX(-100px) : 将元素向左移动100像素。
 * transiiton - 过渡 
 * 
 * -- translate-x-1/10 : 将元素向左移动10%。
 * 
 * 
 */