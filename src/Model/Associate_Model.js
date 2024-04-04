import mongoose from "mongoose";
import { getIndianStates } from "../Utils/apifeatures.js";

const { Schema } = mongoose;

const AssociateSchema = new Schema({
    Associate_Name: {
        type: String,
        required: true
    },
    Associate_Id: {
        type: String,
        required: true,
        unique: true
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
        required: true
    },
    Mother_Name: {
        type: String,
        required: true
    },
    Date_Of_Birth: {
        type: String,
        required: true
    },
    Phone_Number: {
        type: Number,
        required: true,
    },
    Email_Id: {
        type: String,
        required: true,
        unique:true,
    },
    Password: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length >= 6; // Minimum password length of 6 characters
            },
            message: props => `Password must be at least 6 characters long.`
        }
    },
    Confirm_Password: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length >= 6; // Minimum password length of 6 characters
            },
            message: props => `Password must be at least 6 characters long.`
        }
    },
    Select_State: {
        type: String,
        enum: getIndianStates(),
        required: true
    },
    Select_City: {
        type: String,
        required: true,
    },
    Status:{
        type:Boolean,
        required:true,
        default:"true"
    },
    Address:{
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
    }
}, { timestamps: true });

const AssociateModel = mongoose.model("Associate", AssociateSchema);

export  {AssociateModel};
