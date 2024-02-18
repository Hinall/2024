import React, { useState } from 'react'
import './style.css';
import Menu from './menuApi';
import MenuCard from './MenuCard';

const Restaurant = () => {
   const[MenuData,setMenuData]= React.useState(Menu);//hooks -to manage data
   console.log(MenuData);
  return(
    <>
        <MenuCard MenuData={MenuData}/>
    </>
  )
   
  
}

export default Restaurant
