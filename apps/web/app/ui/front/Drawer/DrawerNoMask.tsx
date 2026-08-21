"use client"
//无遮罩抽屉组件
import './DrawerNoMask.css'; 
import React from 'react';
const { useState,useRef } = React;
type DrawerProps={
    show:   boolean,
    children?:   React.ReactNode, 
}
function DrawerNoMask(props : DrawerProps) {
  const { show=true, children } = props; 
  const nodeRef = useRef(null);          
  return (<div style={{position: "relative"}}>
                    <div>
                      <div  ref={nodeRef} className="flex flex-col items-center justify-center  h-screen" style={{width: "250px",backgroundColor: "#222"}}>
                          {children}
                      </div>
                    </div>
          </div>
      ) 
} 
export  default DrawerNoMask; 
