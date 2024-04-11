import mongoose from "mongoose";


const student_Document_schema = new mongoose.Schema({
    Student_Name: {
        type: mongoose.Schema.ObjectId,
        ref: "Student",
        required: true,
      },
    Document: {
        tenth_Dmc: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
        twelve_dmc: {
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
})

const DocumentModel = mongoose.model("Document",student_Document_schema);
export {DocumentModel}

const StudentSchema = new mongoose.Schema({
    Student_Name: {
        type: String,
        required: [true, "Please Enter associate Name"],
        maxlength: [30, "Name cannot exceed 30 characters"],
        minlength: [4, "Name should have more than 4 characters"],
    },
    student_Id: {
        type: String,
        unique: true,
        required: [true, "Please Enter Associate Id"],
        maxlength: [30, "Id cannot exceed 30 characters"],
        minlength: [4, "Id should have more than 4 characters"],
    },
    Associate_Id: {
        type: mongoose.Schema.ObjectId,
        ref: "Associate",
        required: true,
      },
    student_Avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    // Father_Name: {
    //     type: String,
    //     required: [true, "Please Enter Associate Father Name"],
    //     maxlength: [30, "Name cannot exceed 30 characters"],
    //     minlength: [4, "Name should have more than 4 characters"],
    // },
    // Mother_Name: {
    //     type: String,
    //     required: [true, "Please Enter Associate Mother Name"],
    //     maxlength: [30, "Name cannot exceed 30 characters"],
    //     minlength: [4, "Name should have more than 4 characters"],
    // },
    // Date_Of_Birth: {
    //     type: Date,
    //     required: true,
    // },
    // Phone_Number: {
    //     type: Number,
    //     required: [true, "Please Enter your phone no"],
    //     maxlength: [10, "Phone number cannot exceed 10 characters"],
    //     minlength: [10, "Phone number should have 10 characters"],
    // },
    Email_Id: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
    },
    // Password: {
    //     type: String,
    //     required: [true, "Please Enter Your Password"],
    // },
    // Confirm_Password: {
    //     type: String,
    //     required: [true, "Please Enter Your Confirm Password"],
    // },
    // Status: {
    //     type: Boolean,
    //     required: true,
    //     default: true,
    // },
    Address: {
        Select_State: {
            type: String,
            required: true,
        },
        Select_City: {
            type: String,
            required: true,
        },
        village: {
            type: Number,
            required: false,
        },
        // post: {
        //     type: Number,
        //     required: false,
        // },
        // police_station: {
        //     type: Number,
        //     required: false,
        // },
        // pin_code: {
        //     type: Number,
        //     required: true,
        // },
    },
    Document:{
        type: mongoose.Schema.ObjectId,
        ref: "Document",
        required: true,
    },
    college_details:{
        school_name: {
            type: String,
            required: true,
        },
        college_name_get_admission: {
            type: String,
            required: true,
        },
        course_name: {
            type: String,
            required: true,
        },
    }
    
}, { timestamps: true });

const StudentModel = mongoose.model("Student", StudentSchema);

export {StudentModel};
