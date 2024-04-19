import cloudinary from "cloudinary"
export const getIndianStates = () => {
    return [
    "Bihar",
    "Jharkhand"
      ];
};

export const getDistrict = (stateName) => {
  return [
    "East-champaran",

      ];
};
export const deleteFileFromCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(public_id);
    if (result.result !== "ok") {
      throw new Error("Error deleting file from Cloudinary");
    }
  } catch (error) {
    throw new Error("File deleting failed. Please try again.");
  }
};

export const uploadDocumentOnCloudnary = async (file,folder) => {
  try {
    const myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: `${folder}`,
      resource_type: "auto",
    });
    return myCloud
    
  } catch (error) {
    throw new Error("File uploading failed. Please try again.");
  }
};

export const updateToCloudinary = async (file, publicId, options = {}) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      public_id: publicId,
      ...options,
    });
    console.log(`Uploaded file ${file.originalname} to Cloudinary with public ID ${result.public_id}`);
    return result;
  } catch (error) {
    console.error(`Error uploading file to Cloudinary: ${error}`);
    throw error;
  }
};


function searchList(searchQuery, result) {
  const searchItems = result.filter((item) => {
    for (const key in item) {
      if (
        typeof item[key] === "string" &&
        item[key].toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  });
  return searchItems;
}
export const pagination = async (model, page, resultPerPage, searchQuery) => {
  const skip = (page - 1) * resultPerPage;
  
  const totalDocument = await model.countDocuments();
  const totalPages = Math.ceil(totalDocument / resultPerPage);

  const result = await model.find().skip(skip).limit(resultPerPage);
  const results =  searchList(searchQuery, result)

  return {
    currentPage: page,
    totalPages,
    totalDocuments: totalDocument,
    resultPerPage,
    results,
  };
};









