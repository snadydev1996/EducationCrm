import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getIndianStates, getDistrict } from "../Utils/apifeatures.js";

const AssociateSchema = new mongoose.Schema({
  Associate_Name: {
    type: String,
    required: [true, "Please Enter associate Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  Associate_Id: {
    type: String,
    unique: true,
    required: [true, "Please Enter Associate Id"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },

  Phone_Number: {
    type: Number,
    required: [true, "Please Enter your phone no"],
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
      validator: function (value) {
        // Password should be at least 8 characters long
        // It should contain at least one special character and one capital alphabet letter
        const regex = /^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
        return regex.test(value);
      },
      message:
        "Password should be greater than 8 characters and contain at least one special character and one capital letter",
    },
    select: false,
  },
  Status: {
    type: Boolean,
    required: true,
    default: "true",
  },
  Address: {
    Select_State: {
      type: String,
      enum: getIndianStates(),
      required: true,
    },
    Select_District: {
      type: String,
      enum: getDistrict(),
      required: true,
    },
    Sub_Division: {
      type: String,
      required: true,
    },
    Pin_code: {
      type: Number,
      required: true,
    },
    Land_mark: {
      type: String,
      required: false,
    },
    Police_Station: {
      type: String,
      required: true,
    },
  },
  Bank_details: {
    Account_number: {
      type: Number,
      required: true,
    },
    account_holder_name: {
      type: String,
      required: true,
    },
    ifsc_code: {
      type: String,
      required: true,
      uppercase: true, // Ensure the input is converted to uppercase
      validate: {
        validator: function (v) {
          return /^[A-Z]{4}[0][\d]{6}$/.test(v); // Validate IFSC code format
        },
        message: (props) => `${props.value} is not a valid IFSC code.`,
      },
    },
    bank_name: {
      type: String,
      required: true,
    },
    branch_name: {
      type: String,
      required: true,
    },
  },

  Document: {
    Associate_Avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    Pan_Pdf: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    Aadhar_Pdf: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    Passbook_Pdf: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    Marks_Sheet_Pdf: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  Educational_Details: {
    type: String,
    enum: ["10th", "12th", "UG", "PG"],
    required: true,
  },
  Reference: {
    Name: {
      type: String,
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [4, "Name should have more than 4 characters"],
    },
    Phone_No: {
      type: Number,
      maxLength: [10, "Name cannot exceed 30 characters"],
      minLength: [10, "Name should have more than 4 characters"],
    },
  },
  accessType: {
    type: String,
    enum: ["associate", "admin", "student"],
    default: "",
  },
  permissions: {
    type: [String],
    enum: [
      "addassociate",
      "editassociate",
      "deleteassociate",
      "addstudent",
      "editstudent",
      "deletestudent",
    ],
    default: [""],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
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
};
const AssociateModel = mongoose.model("Associate", AssociateSchema);

export { AssociateModel };
