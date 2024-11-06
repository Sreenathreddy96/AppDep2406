import React from 'react';
import { useSelector } from 'react-redux';
import TopNavigation from './TopNavigation';

function Dashboard() {
    const storeObj = useSelector((store) => {
        console.log(store);
        return store;
    });

    const { loginDetails } = storeObj; 

    let deleteProfile = async ()=>{
        let reqOptions ={
            method:"DELETE",
        }
        let jsonData = await fetch(`/deleteProfile?email=${storeObj.loginDetails.email}`,reqOptions);
        let jsoData = await jsonData.json();
        alert(jsoData.msg);
    };
    
    return (
        <div>
            <TopNavigation />
            <h1>Dashboard</h1>
            <button onClick={()=>{
                deleteProfile(); 
            }}>Delete Profile</button>
            {loginDetails ? (
                <>
                    <h1>{loginDetails.firstName} {loginDetails.lastName}</h1>
                    <img 
                        src={`/${loginDetails.profilePic}`} 
                        alt={`${loginDetails.firstName} ${loginDetails.lastName}`} 
                    />
                </>
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    );
}

export default Dashboard;
