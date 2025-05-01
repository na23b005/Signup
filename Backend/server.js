import express from "express";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import collection from "./models/user.js";

import { connectDb } from "./config/db.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("Home");
});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.get("/signup", (req, res) => {
  res.render("Signup");
});

app.post("/signup", async (req, res) => {
  const data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  const existingUser = await collection.findOne({ username: data.username });
  const existingEmail = await collection.findOne({ email: data.email });
  if (existingUser) {
    res.send("Username already exists. Please choose a different username");
  } else {
    if (existingEmail) {
      res.send("Email already registered with another account. Please choose a different email id!");
    } else {
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(data.password,saltRounds);
      data.password = hashedPassword
      await collection.create(data)
      res.send("User Created");
      console.log(userdata);
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ email: req.body.email });

    if (!check) {
      return res.send("User not found. Please sign up first.");
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
    if (isPasswordMatch) {
      if (req.body.email === 'aravindir23@gmail.com') {
      const users = await collection.find({});
      res.send("All Users:<br>" + users.map(user => `Username: ${user.username}, Email: ${user.email}`).join("<br>"));
     }
      
      
      
      
        return res.send(`Login success. Username: ${check.username}, Email: ${check.email}`);
    } else {
      return res.send("Incorrect password");
    }
  } catch (error) {
    console.error(error);
    return res.send("An error occurred during login");
  }
});


app.listen(3000, () => {
  connectDb();
  console.log("Server is running on port 3000");
});
