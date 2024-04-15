import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getIndianStates } from "../Utils/apifeatures.js";

const AssociateSchema = new mongoose.Schema({
    Associate_Name: {
            type: String,
            required: [true, "Please Enter associate Name"],
            maxLength: [30, "Name cannot exceed 30 characters"],
            minLength: [4, "Name should have more than 4 characters"],
          },   
    Associate_Id: {
        type: String,
        unique:true,
        required: [true, "Please Enter Associate Id"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    Associate_Avatar:{
        public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
    },
    Father_Name: {
        type: String,
        required: [true, "Please Enter Associate Father Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    Mother_Name: {
        type: String,
        required: [true, "Please Enter Associate Mother Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    Date_Of_Birth: {
        type: Date,
        required: true
    }, 
    Phone_Number: {
        type: Number,
        required:  [true, "Please Enter your phone no"],
        maxLength: [10, "Name cannot exceed 30 characters"],
        minLength: [10, "Name should have more than 4 characters"],
    },
    Email_Id: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    Password: {
            type: String,
            required: [true, "Please Enter Your Password"],
            validate: {
                validator: function(value) {
                    // Password should be at least 8 characters long
                    // It should contain at least one special character and one capital alphabet letter
                    const regex = /^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
                    return regex.test(value);
                },
                message: 'Password should be greater than 8 characters and contain at least one special character and one capital letter'
            },
            select: false,
        },
    Confirm_Password: {
            type: String,
            required: [true, "Please Enter Your Confirm_Password"],
            validate: {
                validator: function(value) {
                    // Password should be at least 8 characters long
                    // It should contain at least one special character and one capital alphabet letter
                    const regex = /^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
                    return regex.test(value);
                },
                message: 'Password should be greater than 8 characters and contain at least one special character and one capital letter'
            },
            select: false,
    },
    Status:{
        type:Boolean,
        required:true,
        default:"true"
    },
    Address:{
    Select_State: {
        type: String,
        enum: getIndianStates(),
        required: true
    },
    Select_City: {
        type: String,
        required: true,
    },
       street: {
        type:Number,
        required:false
       },
       ward:{
        type:Number,
        required:false
       },
       pin_code:{
        type:Number,
        required:true
       }
    },
    Bank_details:{
        Account_number:{
            type:Number,
            required:true
        },
        ifsc_code: {
            type: String,
            required: true,
            uppercase: true, // Ensure the input is converted to uppercase
            validate: {
                validator: function(v) {
                    return /^[A-Z]{4}[0][\d]{6}$/.test(v); // Validate IFSC code format
                },
                message: props => `${props.value} is not a valid IFSC code.`
            }
        },
        bank_name:{
            type:String,
            required:true
        },
        account_holder_name:{
            type:String,
            required:true
        },
        branch_name:{
            type:String,
            required:true
        }
    },
    // role: {
    //     type: String,
    //     enum: ["associate", "admin","student"],
    //     default: "associate",
    //   },
    //   accessType: {
    //     type: String,
    //     enum: ["associate", "admin","student"],
    //     default: "",
    //   },
    //   permissions: {
    //     type: [String],
    //     enum: [
    //       "addassociate",
    //       "addstudent",     
    //     ],
    //     default:[""],
    //   },
    createdAt: {
        type: Date,
        default: Date.now,
      },
 resetPasswordToken: String,
  resetPasswordExpire: Date,
});

AssociateSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
  });

  // JWT TOKEN
  AssociateSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };
// compared password
AssociateSchema.methods.comparePassword = async function (Password) {
    return await bcrypt.compare(Password, this.Password);
  };

  // Generating Password Reset Token
  AssociateSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  }
const AssociateModel = mongoose.model("Associate", AssociateSchema);

export  {AssociateModel};
