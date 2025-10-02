import User from "../Model/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req,res) =>{
  try {

    const userExist = await User.findOne({username: req.body.username});
    if(userExist){
      return res.status(400).json({message: `Đã tồn tại ${req.body.username}, vui lòng đổi tên người dùng khác`})
    }

    
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashPassword

   
    const user = await User.create(req.body)
    user.password = undefined;

    return res.status(201).json({
      message: "Đăng ký thành công",
      data: user
    })
    
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const login = async (req,res) => {
  try {

    const user = await User.findOne({username: req.body.username}).select("+password");

    if(!user){
      return res.status(400).json({message: "Sai tài khoản"})
    }

   
    const isMatch = await bcrypt.compare(req.body.password,user.password);
    if(!isMatch){
      return res.status(400).json({message: "Sai mật khẩu"})
    }

    
    const token = jwt.sign({id: user.id},"123456",{expiresIn: "5m"})
    
    
    user.password = undefined;
    return res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      data: user
    })
    
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const Logout = async (req, res)=>{
  
}