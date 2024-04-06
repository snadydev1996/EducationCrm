import { AssociateModel } from "../Model/Associate_Model.js";
import cloudinary from "cloudinary";
import catchAsyncErrors from "../Middleware/catchAsyncErrors.js";
import { ErrorHandler } from "../Utils/errorhandler.js";
import { deleteFileFromCloudinary } from "../Utils/apifeatures.js";
import { pagination } from "../Utils/apifeatures.js";

//  Associate create logic start here
const createAssociate = catchAsyncErrors(async (req, res, next) => {
  let public_id;
  try {
    // Check if user with the same email or associate ID already exists
    const existingUser = await AssociateModel.findOne({
      $or: [
        { Email_Id: req.body.Email_Id },
        { Associate_Id: req.body.Associate_Id },
      ],
    });
    if (existingUser) {
      return next(
        new ErrorHandler(
          `User with the same email or Associate_id already exists`,
          400
        )
      );
    }

    if (!req.files || !req.files.Associate_Avatar) {
      return next(new ErrorHandler(`Please select a profile image`, 400));
    }

    const avatar = req.files.Associate_Avatar;
    const myCloud = await cloudinary.v2.uploader.upload(avatar.tempFilePath, {
      folder: "Associate_Avatar",
      resource_type: "auto",
    });
    public_id = myCloud.public_id;

    const {
      Associate_Name,
      Associate_Id,
      Mother_Name,
      Father_Name,
      Date_Of_Birth,
      Phone_Number,
      Email_Id,
      Password,
      Confirm_Password,
      Select_State,
      Select_City,
      Address,
      Bank_details,
      Status,
    } = req.body;

    const associate = await AssociateModel.create({
      Associate_Name,
      Associate_Id,
      Mother_Name,
      Father_Name,
      Date_Of_Birth,
      Phone_Number,
      Email_Id,
      Password,
      Confirm_Password,
      Select_State,
      Select_City,
      Address,
      Bank_details,
      Status,
      Associate_Avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      message: "Associate created successfully.",
    });
  } catch (error) {
    // Handle error
    next(new ErrorHandler(`associate not created sucessfully ${error},500`));
    // If there's an error, delete the uploaded file from Cloudinary
    if (public_id) {
      await deleteFileFromCloudinary(public_id);
    }
  }
});
const getAssociate = catchAsyncErrors(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const resultPerPage = parseInt(req.query.perPage) || 5;
    const searchQuery =
      req.query.Associate_Id || req.query.Associate_Name || "";

    // Perform pagination and search
    const associate = await pagination(
      AssociateModel,
      page,
      resultPerPage,
      searchQuery
    );
    if (associate.results.length === 0) {
      return next(new ErrorHandler(`No associate found`, 200));
    }
    res.status(200).json({
      success: true,
      ...associate,
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(new ErrorHandler("Internal Server Error", 500));
  }
});

const updateAssociate = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.Associate_Avatar) {
    return next(new ErrorHandler(`please select a associate_avatar`, 400));
  }
  const Associate_Avatar = req.files.Associate_Avatar;
  const {
    Associate_Name,
    Associate_Id,
    Mother_Name,
    Father_Name,
    Date_Of_Birth,
    Phone_Number,
    Email_Id,
    Password,
    Confirm_Password,
    Select_State,
    Select_City,
    Address,
    Bank_details,
    Status,
  } = req.body;
  const latestAssociate = await AssociateModel.findById(req.params.id);

  const oldAvatar = latestAssociate.Associate_Avatar.public_id;
  const myCloud = await cloudinary.v2.uploader.upload(
    Associate_Avatar.tempFilePath,
    {
      public_id: oldAvatar,
      overwrite: true,
      invalidate: true,
    }
  );
  const new_Avatar = {
    Associate_Name,
    Associate_Id,
    Mother_Name,
    Father_Name,
    Date_Of_Birth,
    Phone_Number,
    Email_Id,
    Password,
    Confirm_Password,
    Select_State,
    Select_City,
    Address,
    Bank_details,
    Status,
    Associate_Avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  };
  const latest_Associate = await AssociateModel.findByIdAndUpdate(
    req.params.id,
    new_Avatar,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "document updated  successfully.",
    latest_Associate,
  });
});

const deleteAssociate = catchAsyncErrors(async (req, res, next) => {
  const Associate = await AssociateModel.findById(req.params.id);
  if (!Associate) {
    return next(
      new ErrorHandler(
        `associate does not exist with Id: ${req.params.id}`,
        400
      )
    );
  }
  const public_id = Associate.Associate_Avatar.public_id;
  const myCloud = await cloudinary.v2.uploader.destroy(public_id);

  if (myCloud.result === "ok") {
    try {
      await AssociateModel.findByIdAndDelete(req.params.id);
    } catch (error) {
      return next(
        new ErrorHandler(`Failed to delete associate from the database`, 500)
      );
    }
  }
  res.status(200).json({
    success: true,
    message: "associate Delete Successfully",
  });
});

export { createAssociate, getAssociate, updateAssociate, deleteAssociate };
