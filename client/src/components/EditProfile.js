import React, { useEffect, useRef, useState } from "react";
import TopNavigation from "./TopNavigation";
import { useSelector } from "react-redux";

function EditProfile() {
  let firstNameInputRef = useRef();
  let lastNameInputRef = useRef();
  let ageInputRef = useRef();
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let mobileNoInputRef = useRef();
  let profilePicInputRef = useRef();

  let [profilePic, setprofilePic] = useState("./images/NO_Image_Available.jpg"); 

  let storeObj = useSelector((store)=>{
    return store;
  });

  useEffect(()=>{
    firstNameInputRef.current.value = storeObj.loginDetails.firstName; 
    lastNameInputRef.current.value = storeObj.loginDetails.lastName; 
    ageInputRef.current.value = storeObj.loginDetails.age; 
    emailInputRef.current.value = storeObj.loginDetails.email; 
    mobileNoInputRef.current.value = storeObj.loginDetails.mobileNo; 
    setprofilePic(`http://localhost:8889/${storeObj.loginDetails.profilePic}`);
  },[]);


  let onUpdateProfile = async () => { 
    let sendData = new FormData(); 

    sendData.append("firstName", firstNameInputRef.current.value);
    sendData.append("lastName", lastNameInputRef.current.value);
    sendData.append("age", ageInputRef.current.value);
    sendData.append("email", emailInputRef.current.value);
    sendData.append("password", passwordInputRef.current.value);
    sendData.append("mobileNo", mobileNoInputRef.current.value);

    for (let i = 0; i < profilePicInputRef.current.files.length; i++) {
      sendData.append("profilePic", profilePicInputRef.current.files[i]);
    }

    let reqeustOptions = {
      method: "PATCH",
      body: sendData,
    };

    let jsonData = await fetch("http://localhost:8889/updateProfile", reqeustOptions);
    let jsoData = await jsonData.json();
    console.log(jsoData);
    alert(jsoData.msg);
    console.log(sendData);
  };

  return (
    <div>
        <TopNavigation/>
      <form>
        <h1>Edit Profile</h1>
        <div>
          <label>FirstName</label>
          <input ref={firstNameInputRef}></input>
        </div>
        <div>
          <label>LastName</label>
          <input ref={lastNameInputRef}></input>
        </div>
        <div>
          <label>Age</label>
          <input ref={ageInputRef}></input>
        </div>
        <div>
          <label>Email</label>
          <input ref={emailInputRef} readOnly></input>
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>
        <div>
          <label>MobileNo</label>
          <input ref={mobileNoInputRef}></input>
        </div>
        <div>
          <label>ProfilePic</label>{" "}
          <input
            type="file"
            ref={profilePicInputRef}
            accept="image/*"
            onChange={(eo) => {
              let selectedImgPath = URL.createObjectURL(eo.target.files[0]);
              setprofilePic(selectedImgPath);
            }}
          ></input>
        </div>
        <img src={profilePic} alt="imageasdfghj"></img>
        <div>
          <button
            type="button"
            onClick={() => {
              onUpdateProfile();
            }}
          >
            Update Profile 
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;