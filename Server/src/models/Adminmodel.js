
import mongoose from "mongoose";

import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);




adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2d" }
    );
};

export default mongoose.model("Admin", adminSchema);
