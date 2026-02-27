import Adminmodel from "../models/adminmodel.js"
import bcrypt from "bcrypt"


const admincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password?.trim();


    if ([normalizedEmail, normalizedPassword].some(field => !field || field === "")) {
      return res.status(400).send({
        message: "All fields are required",
        status: "not success"
      });
    }


    const admin = await Adminmodel.findOne({ email: normalizedEmail })
    console.log(admin)
    if (!admin) {
      return res.status(400).send({
        message: "Invalid email or password",
        status: "not success"
      });
    }

    const storedHash = admin.password?.trim();
    const isPasswordCorrect = await bcrypt.compare(
      normalizedPassword,
      storedHash
    );
    console.log("Plain password:", normalizedPassword);
    console.log("Hashed password:", storedHash);
    console.log("Password match:", isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.status(200).send({
        message: "Invalid email or password",
        status: "not success"
      });
    }






    const token = admin.generateAccessToken();


    return res.status(200).send({
      message: "Admin login successfully",
      status: "success",
      token
    });

  } catch (error) {
    return res.status(500).send({
      message: "Login controller error",
      error: error.message,
      status: "failed"
    });
  }
};

export { admincontroller }
