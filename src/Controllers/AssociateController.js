import { AssociateModel } from "../Model/Associate_Model.js";
import cloudinary from "cloudinary";
import catchAsyncErrors from "../Middleware/catchAsyncErrors.js";
import { ErrorHandler } from "../Utils/errorhandler.js";
import {
  deleteFileFromCloudinary,
  uploadDocumentOnCloudnary,
  updateToCloudinary
} from "../Utils/apifeatures.js";
import { pagination } from "../Utils/apifeatures.js";
import { Token } from "../Utils/userToken.js";
const createAssociate = catchAsyncErrors(async (req, res, next) => {
  let public_idsToDelete = []
  try {
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
    let Document = {};

    if (
      !req.files &&
      !req.files.Document &&
      !req.files.Document.Associate_Avatar &&
      !req.files.Document.Marks_Sheet_Pdf &&
      !req.files.Document.Passbook_Pdf &&
      !req.files.Document.Pan_Pdf &&
      !req.files.Document.Aadhar_Pdf
    ) {
      return next(new ErrorHandler(`Please select a profile image`, 400));
    }

    const avatar = req.files.Document.Associate_Avatar;
    const pan = req.files.Document.Pan_Pdf;
    const aadhar = req.files.Document.Aadhar_Pdf;
    const marks_sheet = req.files.Document.Marks_Sheet_Pdf;
    const Passbook = req.files.Document.Passbook_Pdf;
    if (pan) {
      const myCloud = await uploadDocumentOnCloudnary(
        pan,
        "associate_document"
      );
      Document["Pan_Pdf"] = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
      public_idsToDelete.push(myCloud.public_id);
    }
    if (aadhar) {
      const myCloud = await uploadDocumentOnCloudnary(
        aadhar,
        "associate_document"
      );
      Document["Aadhar_Pdf"] = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
      public_idsToDelete.push(myCloud.public_id);
    }
    if (Passbook) {
      const myCloud = await uploadDocumentOnCloudnary(
        Passbook,
        "associate_document"
      );
      Document["Passbook_Pdf"] = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
      public_idsToDelete.push(myCloud.public_id);
    }
    if (marks_sheet) {
      const myCloud = await uploadDocumentOnCloudnary(
        marks_sheet,
        "associate_document"
      );
      Document["Marks_Sheet_Pdf"] = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
      public_idsToDelete.push(myCloud.public_id);
    }
    if (avatar) {
      const myCloud = await uploadDocumentOnCloudnary(
        avatar,
        "associate_document"
      );
      Document["Associate_Avatar"] = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
      public_idsToDelete.push(myCloud.public_id);
    }
    const {
      Associate_Name,
      Associate_Id,
      Phone_Number,
      Email_Id,
      Password,
      Address,
      Bank_details,
      Educational_Details,
      permissions,
      accessType,
      Reference,
      Status,
    } = req.body;

    const associate = await AssociateModel.create({
      Associate_Name,
      Associate_Id,
      Phone_Number,
      Email_Id,
      Password,
      Address,
      Bank_details,
      Educational_Details,
      permissions,
      accessType,
      Reference,
      Status,
      Document,
    });
    Token(associate, 201, "associate created successfully", res);
  } catch (error) {
    // Handle error
    next(new ErrorHandler(`associate not created sucessfully ${error},500`));
 
    for (const public_id of public_idsToDelete) {
      try {
        await deleteFileFromCloudinary(public_id);
        console.log(`Successfully deleted file with public ID ${public_id} from Cloudinary`);
      } catch (deleteError) {
        console.error(`Error deleting file with public ID ${public_id} from Cloudinary:`, deleteError);
      }
    }
  }
});

// Login User
const loginAssociate = catchAsyncErrors(async (req, res, next) => {
  const { Email_Id, Password, Associate_Id } = req.body;

  if (!(Associate_Id || Email_Id) && !Password) {
    return next(new ErrorHandler("Please enter username and password", 400));
  }
  const Associate = await AssociateModel.findOne({
    $or: [{ Email_Id }, { Associate_Id }],
  }).select("+Password");
  if (!Associate) {
    return next(
      new ErrorHandler(`Invalid ${Object.keys(req.body)[0]} or  password`, 401)
    );
  }

  const isPasswordMatched = Associate.comparePassword(Password);

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler(`Invalid ${Object.keys(req.body)[0]} or password`, 401)
    );
  }

  Token(Associate, 201, "Login successfully", res);
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
  if (
    !req.files &&
    !req.files.Document &&
    !req.files.Document.Associate_Avatar &&
    !req.files.Document.Marks_Sheet_Pdf &&
    !req.files.Document.Passbook_Pdf &&
    !req.files.Document.Pan_Pdf &&
    !req.files.Document.Aadhar_Pdf
  ) {
    return next(new ErrorHandler(`please select a associate_avatar`, 400));
  }
  const Associate_Avatar = req.files.Document.Associate_Avatar;
  const Passbook_Pdf = req.files.Document.Passbook_Pdf;
  const Pan_Pdf = req.files.Document.Pan_Pdf;
  const Aadhar_Pdf = req.files.Document.Aadhar_Pdf;
  const Marks_Sheet_Pdf = req.files.Document.Marks_Sheet_Pdf;
  const {
    Associate_Name,
    Associate_Id,
    Phone_Number,
    Email_Id,
    Password,
    Address,
    Bank_details,
    Educational_Details,
    permissions,
    accessType,
    Reference,
    Status,
  } = req.body;
  const latestAssociate = await AssociateModel.findById(req.params.id);

  const oldAvatar = latestAssociate.Document.Associate_Avatar.public_id;
  const oldPan = latestAssociate.Document.Pan_Pdf.public_id;
  const oldAadhar = latestAssociate.Document.Aadhar_Pdf.public_id;
  const oldPaasbook = latestAssociate.Document.Passbook_Pdf.public_id;
  const oldMarkssheet = latestAssociate.Document.Marks_Sheet_Pdf.public_id;

 
  const myavtar = await cloudinary.v2.uploader.upload(
    Document.Associate_Avatar.tempFilePath,
    {
      public_id: oldAvatar,
      overwrite: true,
      invalidate: true,
    }
  );
  const mypan = await cloudinary.v2.uploader.upload(
    Document.Pan_Pdf.tempFilePath,
    {
      public_id: oldPan,
      overwrite: true,
      invalidate: true,
    }
  );
  const mypasbook = await cloudinary.v2.uploader.upload(
    Document.Passbook_Pdf.tempFilePath,
    {
      public_id: oldPaasbook,
      overwrite: true,
      invalidate: true,
    }
  );
  const mymarkssheet = await cloudinary.v2.uploader.upload(
    Document.Marks_Sheet_Pdf.tempFilePath,
    {
      public_id: oldMarkssheet,
      overwrite: true,
      invalidate: true,
    }
  );
  const myaadhar = await cloudinary.v2.uploader.upload(
    Document.Aadhar_Pdf.tempFilePath,
    {
      public_id: oldAadhar,
      overwrite: true,
      invalidate: true,
    }
  );
  let Document= {}

  Document.property1 = myavtar;
  Document.property2 = myaadhar;
  Document.property3 = mymarkssheet;
  Document.property4 = mypan;
  Document.property5 = mypasbook;

  const new_Associate = {
    Associate_Name,
    Associate_Id,
    Phone_Number,
    Email_Id,
    Password,
    Address,
    Bank_details,
    Educational_Details,
    permissions,
    accessType,
    Reference,
    Status,
    Document
  };
  const latest_Associate = await AssociateModel.findByIdAndUpdate(
    req.params.id,
    new_Associate,
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
  console.log(Associate);
  if (!Associate) {
    return next(
      new ErrorHandler(
        `associate does not exist with Id: ${req.params.id}`,
        400
      )
    );
  }
  const public_id1 = Associate.Document.Associate_Avatar
    ? Associate.Document.Associate_Avatar.public_id
    : null;
  const public_id2 = Associate.Document.Pan_Pdf
    ? Associate.Document.Pan_Pdf.public_id
    : null;
  const public_id3 = Associate.Document.Aadhar_Pdf
    ? Associate.Document.Aadhar_Pdf.public_id
    : null;
  const public_id4 = Associate.Document.Passbook_Pdf
    ? Associate.Document.Passbook_Pdf.public_id
    : null;
  const public_id5 = Associate.Document.Marks_Sheet_Pdf
    ? Associate.Document.Marks_Sheet_Pdf.public_id
    : null;
  const my_clouds =[
    public_id1,
    public_id2,
    public_id3,
    public_id4,
    public_id5,
  ];
  let deletionResults = [];
  for (const public_id of my_clouds) {
    try {
      let deletionResult = await cloudinary.v2.uploader.destroy(public_id);
      deletionResults.push(deletionResult.result);
      console.log(`Resource with public ID ${public_id} has been destroyed.`);
    } catch (error) {
      console.error(
        `Error destroying resource with public ID ${public_id}:`,
        error
      );
    }
  }
  // Check if all deletions were successful
  if (deletionResults.every((result) => result === "ok" || "not found")) {
    try {
      await AssociateModel.findByIdAndDelete(req.params.id);
    } catch (error) {
      return next(
        new ErrorHandler(
          `Failed to delete associate from the database: ${error}`,
          500
        )
      );
    }
  }
  res.status(200).json({
    success: true,
    message: "associate Delete Successfully",
  });
});
export {
  createAssociate,
  getAssociate,
  updateAssociate,
  deleteAssociate,
  loginAssociate,
};
