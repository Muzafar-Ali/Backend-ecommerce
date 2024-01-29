import Order from "../models/orderModel.js";
import Product  from "../models/productModel.js";
import { stripe } from "../server.js";

//CREATE ORDER
export const createOrder = async (req, res) => {
  
  const {
    shippingInfo,
    orderItems,
    itemPrice,
    tax,
    shippingCharges,
    totalAmount,
  } = req.body;

  if( !shippingInfo || !orderItems || !itemPrice || !tax || !shippingCharges || !totalAmount ){
    return res.status(400).json({
        success: false,
        message: "Please fill all the fields"
    });
  }

  // Access the user ID from the authenticated user
  const userId = req.user._id;
  const paymentInfo = "Cash on delivery";
  
  if(!userId){
    return res.status(400).json({
        success: false,
        message: "User not found"
    });
  }

  const order = await Order.create({
    user: userId,
    shippingInfo,
    orderItems,
    paymentMethod,
    paymentInfo,
    itemPrice,
    tax,
    shippingCharges,
    totalAmount,
    orderStatus,
    paidAt: Date.now()
  });

  //stock update
  for (let i = 0; i < orderItems.length; i++) {
    //find product
    const product = await Product.findById(orderItems[i].product);
    //update stock
    product.stock -= orderItems[i].quantity;
    //save product
    await product.save();
  }
  res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
  })

  try {
    const order = await Order.create({ name, email, address, phone, amount });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in create order API ${error.message}`  
    });
  }
}

//GET MY All ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    if(!orders){
        return res.status(404).json({
            success: false,
            message: "No orders found"
        });
    }

    res.status(200).json({
      success: true,
      total_orders: orders.length,
        orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in get my orders API ${error.message}`  
    });
  }
}

//GET MY SINGLE ORDER
export const getMySingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if(!order){
      return res.status(404).json({
        success: false,
        message: "No order found"
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    if(error.name === "CastError"){
      return res.status(404).json({
        success: false,
        message: "Invalid product id",
      });
    }
    res.status(500).json({
      success: false,
      message: `Error in get single order API ${error.message}`  
    });
  }
}

//Payment Controller for stripe payment
export const paymentController = async (req, res) => {
  const { totalAmount } = req.body;
  if (!totalAmount) {
    return res.status(400).json({
      success: false,
      message: "Please provide total amount",
    });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "usd",
    payment_method_types: ["card"],
  });
  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.id,
  });
}


// ***************** ADMIN SECTION *************** //

//GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    if(!orders){
        return res.status(404).json({
            success: false,
            message: "No orders found"
        });
    }

    res.status(200).json({
      success: true,
      total_orders: orders.length,
        orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in get all orders API ${error.message}`  
    });
  }
}

//CHANGE ORDER STATUS
export const changeOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const { status } = req.body;
    if(!status){
      return res.status(400).json({
        success: false,
        message: "Please provide status"
      });
    }

    if(!order){
      return res.status(404).json({
        success: false,
        message: "No order found"
      });
    }

    if(order.orderStatus === status){
      return res.status(400).json({
        success: false,
        message: `Order status already updated with ${status} status`
      });
    }

    if(order.orderStatus === "delivered"){
      return res.status(400).json({
        success: false,
        message: "Order already delivered"
      });
    }

    if(status === "delivered"){
      order.deliveredAt = Date.now();
    }
    if(status === "shipped"){
      order.shippedAt = Date.now();
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully"
    });
  } catch (error) {
    if(error.name === "CastError"){
      return res.status(404).json({
        success: false,
        message: "Invalid order id",
      });
    }
    res.status(500).json({
      success: false,
      message: `Error in change order status API ${error.message}`  
    });
  }
}
