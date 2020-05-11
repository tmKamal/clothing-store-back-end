const HttpError = require("../models/http-error");

const {validationResult}=require("express-validator");

const Admin=require("../models/admin");

const getAllAdmins=async (req,res,next)=>{
    let admins;
    try{

        admins=await Admin.find({},'-password');
    }catch(err){
        const error=new HttpError('something went wrong on the db, when retriving the admins',500);
        return next(error);
    }
    res.status(200).json({admins:admins.map((u)=>u.toObject({getters:true}))});
}

const signUp= async(req,res,next)=>{
    const validationError=validationResult(req);
    if(!validationError.isEmpty()){
        return next(new HttpError("Please fill out all the fields carefully.", 422));
    }
    const {name,email,password}=req.body;
    let hasRegistered;
    try{

        hasRegistered=await Admin.findOne({email:email});
    }catch(err){
        const error=new HttpError('something went wrong on db side');
        return next(error);
    }
    if(hasRegistered){
        return next(new HttpError("Email is not available! use a different one!!",422));
    }
    const newAdmin=new Admin({
        
        name,
        email,
        password,
        image:'https://robohash.org/HFB.png?set=set3'
    });
    
    try{

        await newAdmin.save();
    }catch(err){
        const error=new HttpError('Sign up process has failed, error on db',500);
        return next(error);
    }


    res.status(201).json({admin:newAdmin.toObject({getters:true})});
}


const login=async(req,res,next)=>{
    const {email,password}=req.body;
    let identifiedAdmin;
    try{
        
        identifiedAdmin= await Admin.findOne({email:email})
    }catch(err){
        const error=new HttpError('something went wrong on db side!');
        return next(error);
    }
    if(!identifiedAdmin || identifiedAdmin.password !==password){
        return next(new HttpError("Email or password is not correct!",401));
    }
    res.json({message:"Admin logged in!!",admin:identifiedAdmin.toObject({getters:true})});
}


exports.login=login;
exports.getAllAdmins=getAllAdmins;
exports.signUp=signUp;