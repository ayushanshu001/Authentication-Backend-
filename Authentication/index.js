const express = require("express");
const app = express();
const { connection } = require("./Config/db");
const { Usermodel } = require("./Model/User.model");
var jwt = require('jsonwebtoken');

app.use(express.json());



app.get("/", (req, res) => {
  res.send("Welcome To Homepage");
});

app.get("/dashboard", (req, res) => {
    const{token}=req.query
    var decoded = jwt.verify(token, 'shhhhh');
    if(decoded){
        res.send("Some important data");
    }else{
        res.send('Please login')
    }
});

app.get("/report", (req, res) => {
    const{token}=req.query
    if(Number(token)===54321){
        res.send("Some important reports");
    }else{
        res.send('Please login')
    }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const result = await Usermodel.findOne({ email });
  if (result) {
    res.send("Email already exits");
  } else {
    const new_User = new Usermodel({
      email,
      password,
    });
    await new_User.save();
    res.send("Signup Successfull");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await Usermodel.find({ email, password });
  if (result.length > 0) {
    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    res.send({"msg":"Login Successfull","token":token});
  } else {
    res.send("Invalid Credientials");
  }
});

app.listen(8080, async () => {
  try {
    await connection;
    console.log("Connected to Database");
  } catch (error) {
    console.log("Error in Database");
    console.log(error);
  }
  console.log("Port is running on 8080");
});
