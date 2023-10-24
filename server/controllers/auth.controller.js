const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const config = require("../config");
const User = require("../models/user.model");

const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: config.EMAIL_SECURE,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD,
    },
});

const sendVerificationEmail = async (email) => {
    const token = jwt.sign({ email }, config.JWT_SECRET);
    const url = `https://${config.DOMAIN}/verification-email/${token}`;

    const mailOptions = {
        from: config.EMAIL_USER,
        to: email,
        subject: "Email Verification",
        html: `<p>Please click <a href="${url}">here</a> to verify your email.</p>`,
    };

    await transporter.sendMail(mailOptions);
};

const sendResetPasswordEmail = async (email) => {
    const user = await User.findOne({ email });
    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
        expiresIn: config.JWT_LIFETIME,
    });
    const url = `https://${config.DOMAIN}/reset-password/${token}`;

    const mailOptions = {
        from: config.EMAIL_USER,
        to: email,
        subject: "Reset Password",
        html: `<p>Please click <a href="${url}">here</a> to reset your password.</br></br>
        This link will expire in ${config.JWT_LIFETIME / 3600} hours.</p>`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { transporter, sendVerificationEmail, sendResetPasswordEmail };
