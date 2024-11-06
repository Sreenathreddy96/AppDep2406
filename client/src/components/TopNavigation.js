import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'

function TopNavigation() {

let navigate = useNavigate();

    let storeObj = useSelector((store)=>{
return store;
    });

    useEffect(()=>{
        if(storeObj && storeObj.loginDetails && storeObj.loginDetails.email){

        }else{
            navigate("/");
        }
    },[])

  return (
    <div>
        <nav className='nav'>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/tasks">Tasks</NavLink>
            <NavLink to="/leaves">Leaves</NavLink>
            <NavLink to="/editProfile">Update Profile</NavLink>
            
            <NavLink to="/" onClick={()=>{
                localStorage.clear();
            }}>Signout</NavLink>
        </nav>
    </div>
  )
};

export default TopNavigation