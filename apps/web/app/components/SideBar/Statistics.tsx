//  静态数据栏设置 

import Link from 'next/link';
import React, { Component } from 'react'; 


const  Statistics  = () => {
    return (           
            <div className="statistics w-full mt-3 mb-3 flex items-center justify-center flex-wrap gap-5 text-base " style={{color:"#999999"}}> 
                <Link  href="/blog" className="flex items-center justify-center flex-col hover:text-[#e7e9e9]">
                    <div className=" text-2xl font-bold">100</div>
                    <div >日志</div>
                </Link>
                <Link  href="/category" className="flex items-center justify-center flex-col hover:text-[#e7e9e9]">
                    <div className=" text-2xl font-bold" >100</div>
                    <div >分类</div>
                </Link>
                   <Link  href="/tag" className="flex items-center justify-center flex-col hover:text-[#e7e9e9]">
                    <div  className=" text-2xl font-bold">100</div>
                    <div >标签</div>
                </Link>
            </div>
        );
    }
export default Statistics;


