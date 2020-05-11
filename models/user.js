const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},//this will create an seperate id for email. but to uniqe this email from the database we have to import a seperate 3rd party package.
    password:{type:String,required:true,minlength:4},
    purchased:{type:String,require:true},
    image:{type:String,required:true}
})

userSchema.plugin(uniqueValidator);// to add the unique behaviour to the email, using a 3rd party package as mentioned above.
module.exports=mongoose.model('User',userSchema);//Manager->(managers will be the name of the collection.)

