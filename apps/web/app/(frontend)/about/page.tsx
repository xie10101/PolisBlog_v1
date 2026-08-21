import classes from "./about.module.css"; 
const  About =  async () => {
//  直接 HTML实现 
// 提高复用      
    return (
         <>
         <div className="flex flex-col justify-center items-center">
            <div className=" flex flex-col justify-center items-center w-200 pt-15">
                <header className={classes.title}>关于XIEX</header>
                <div >
                    <h2 className={classes.h2}   >
         介绍 
                    </h2>
                    <p className={classes.p}>我是一个前端开发工程师，热爱编程和设计。我擅长使用React、Vue等前端框架进行开发，同时也熟悉HTML、CSS、JavaScript等基础技术。</p>
                     <h2 className={classes.h2}>
         工作经历 
                     </h2>
                    <p className={classes.p}>在工作中，我注重用户体验和代码质量，努力为用户提供最好的产品和服务。我也喜欢学习新技术和新知识，不断提升自己的技能和能力。</p>
                </div>
                <footer>联系方式</footer>
            </div>
         </div>

         </>
    );
};

export default About; 
