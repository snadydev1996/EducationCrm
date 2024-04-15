import jwt from "jsonwebtoken";

const Token = (associate, statusCode, message, res) => {
    const token = jwt.sign(  
      {  Associate_Name: associate. Associate_Name, id:  associate._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    // const { permissions, role, accessType } = associate;
    // const associateInfo = {
    //   token,
    //   permissions,
    //   role,
    //   accessType,
    // };
    const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res
    .status(statusCode)
    .cookie(
      "Token", token,
      options
    )
    .json({
      success: true,
      message: message,
      associate,
      token
    });

  
    // res
    //   .status(statusCode)
    //   .cookie(
    //     associate.accessType === "admin" ? "UIDA" : "UIDE",
    //     JSON.stringify(associateInfo),
    //     options
    //   )
    //   .json({
    //     success: true,
    //     message: message,
    //     accessType: associate.accessType,
    //     token: associateInfo
    //   });
  };

  export {Token}