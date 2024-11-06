const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("node:path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

let app = express();
app.use(cors());
app.use("/uploads",express.static("uploads"));
app.use(express.static(path.join(__dirname,"/client/build")));

// let authorize = (req,res,next) => {
//   console.log("inside authorize mwf");
//   console.log(req.headers.authorization);
//   next();
// };

//app.use(authorize);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); 
  }, 

  filename: (req, file, cb) => {
    console.log(file); 
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${Date.now()}_${file.originalname}`);
  },

});

const upload = multer({ storage: storage });

let userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number, 
  email: String,
  password: String,
  mobileNo: String,
  profilePic: String,
});

let User = new mongoose.model("user", userSchema);

app.get("*",(req,res)=>{
  res.sendFile("./client/build/index.html");
});

app.post("/Login", upload.none(), async (req, res) => {
    console.log(req.body);
    let userDetails = await User.find().and({email:req.body.email});

    console.log(userDetails);

    if(userDetails.length > 0){

  let isPasswordValid = await bcrypt.compare(req.body.password,userDetails[0].password);

if(isPasswordValid == true){
  let encryptedCred = jwt.sign({email:req.body.email, password:req.body.password},"abracadabra");

let loginDetails ={
    firstName:userDetails[0].firstName,
    lastName:userDetails[0].lastName,
    age:userDetails[0].age,
    email:userDetails[0].email,
    mobileNo:userDetails[0].mobileNo,
    profilePic:userDetails[0].profilePic,
    token: encryptedCred,
};

res.json({status:"Success",data:loginDetails});
}else{
    res.json({status:"Failed",msg:"Invalid Password"});
}      
    }else{
        res.json({status:"Failed",msg:"User doesnot exist"});
    }

  });


app.post("/validateToken", upload.none(), async (req,res) =>{
    console.log(req.body);

    let decryptedCred = jwt.verify(req.body.token,"abracadabra");

    let userDetails = await User.find().and({email:decryptedCred.email});

    if(userDetails.length > 0){
        console.log(userDetails);

if(userDetails[0].password == decryptedCred.password){
  
let loginDetails ={
    firstName:userDetails[0].firstName,
    lastName:userDetails[0].lastName,
    age:userDetails[0].age,
    email:userDetails[0].email,
    mobileNo:userDetails[0].mobileNo,
    profilePic:userDetails[0].profilePic,
};

res.json({status:"Success",data:loginDetails});
}else{
    //res.json({status:"Failed",msg:"Invalid Password"});
}      
    }else{
        res.json({status:"Failed",msg:"User doesnot exist"});
    }
  });


app.post("/signup", upload.single("profilePic"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  let hashedPassword = await bcrypt.hash(req.body.password,10);

  try {
    let user1 = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      email: req.body.email,
      password: hashedPassword,
      mobileNo: req.body.mobileNo,
      profilePic: req.file.path,
    });

    await User.insertMany([user1]);

    res.json({ status: "Success", msg: "Successfully created User" });
  } catch (error) {
    res.json({ status: "Failed", msg: "Unable to create User", error });
  }
});


app.patch("/updateProfile", upload.single("profilePic"), async (req,res) => {

  try {

  if(req.body.firstName.trim().length > 0) {
    await User.updateMany({email:req.body.email},{firstName:req.body.firstName});
  }

  if(req.body.lastName.trim().length > 0) {
    await User.updateMany({email:req.body.email},{lastName:req.body.lastName});
  }

  if(req.body.age > 0) {
    await User.updateMany({email:req.body.email},{age:req.body.age});
  }

  if(req.body.password.length > 0) {
    await User.updateMany({email:req.body.email},{password:req.body.password});
  }

  if(req.body.mobileNo.trim().length > 0) {
    await User.updateMany({email:req.body.email},{mobileNo:req.body.mobileNo});
  }

  if(req.file && req.file.path) {
    await User.updateMany({email:req.body.email},{profilePic:req.body.path});
  }

  res.json({status: "success", msg: "Profile updated successfully"});
} catch (error) {
  res.json({status: "failure", msg: "Unable to update your profile. Something went wrong. Please try again after sometime"});
}

});

app.delete("/deleteProfile", async (req,res) => {
 let delResult = await User.deleteMany({ email: req.query.email });
 console.log(delResult);

 if(delResult.deletedCount > 0){

   res.json({ status: "success", msg: "User deleted successfully."});
  }else{
  res.json({ status: "failure", msg: "Unable to delete account."});
  }
});
app.listen(process.env.port,()=>{
    console.log(`Listening to port ${process.env.PORT}`);
});

let connectToMDB = async ()=>{
    try{
      mongoose.connect(process.env.mdbUrl);
   console.log("Successfully connected to MDB")
    }catch(err){
        console.log("Unable to connect to MDB");
    }
    };

    connectToMDB();