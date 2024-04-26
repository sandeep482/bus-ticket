const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
require('dotenv').config();


const cityRouter = require("./src/controllers/city.controller");
const busRouter = require("./src/controllers/bus.controller");
const userRouter=require("./src/controllers/user.controller");
const orderRouter=require("./src/controllers/order.controller")
const paymentController = require('./src/controllers/payment.controller');

const city =require("./src/models/city.model.js");
const bus =require("./src/models/bus.model.js");
const order =require("./src/models/order.model.js");
const user =require("./src/models/user.model.js");

//const connect = require("./src/configs/db");
const connectDB = require("./src/configs/db.js");

app.use(cors());
app.use(express.json());

app.use("/user",userRouter)
app.use("/city", cityRouter);
app.use("/busses", busRouter);
app.use("/order", orderRouter);

app.use("/busses",bus);
app.use("/cities",city);
app.use("/order",order);
app.use("/users",user);

app.use(express.json());
connectDB(); // Connect to MongoDB

// Routes
app.use("/users", userRouter);


//Razorpay payment
app.use("/api/payment", paymentController);

app.listen(port, async () => {
  try {
    await connectDB();
    console.log(`listening on http://localhost:3000`);
  } catch (error) {
    console.log(error.message);
  }
});
