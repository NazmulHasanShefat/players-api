import bcrypt from "bcryptjs";
import DreemUser from "../model/dreemUser.model.js";
import jwt from "jsonwebtoken";
import { transporter } from "../config/nodeMailer.js";
import { UAParser } from "ua-parser-js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.json({ success: false, message: "username email or password are required" });
    }
    try {
        const existingUser = await DreemUser.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "same user alrady exist" });
        }
        const HashdPassword = await bcrypt.hash(password, 12);

        // create new user
        const user = new DreemUser({ username, email, password: HashdPassword });
        await user.save();

        // genarate user token 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRAT, { expiresIn: "1d" });

        // set token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000
        })

        res.json({ success: true, message: "user registerd successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// ============================================== USER LOGIN ================================================
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return res.json({ success: false, message: "username or email are require " });
    }
    try {
        const user = await DreemUser.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email" });
        }

        // check password 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRAT, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, message: "you are successfully loged in" })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// ============================================== USER LOG OUT ===============================================
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        })
        res.json({ success: true, message: "you are successfully loged out" })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// ============================================= SEND VERIFY OTP ==============================================
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await DreemUser.findById(userId);

        // userIsVerified property from DreemUser model (user model)
        if (user.userIsVerified) {
            return res.json({ success: false, message: "acount alrady verifide" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;

        user.verifyOtpExpireAt = Date.now() + 1 * 2 * 60 * 1000;

        await user.save();

        // send email
        const emailOptions = {
            from: process.env.SENDER_EMAIL, // sender address
            to: user.email, // list of recipients
            subject: `your verification otp is: ${otp}`, // subject line
            text: `
              <h1>Acount varification Otp</h1>
            <h3>Your verification code is: ${otp}</h3>
            <p>This code expires in 10 minutes. Do not share it with anyone.</p>
            – [From userAuth app]
            `
        }
        await transporter.sendMail(emailOptions);
        res.json({ success: true, message: "verification email send successfully"})

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// ==================================== VERIFY OTP WHEN USER SUBMIT THE OTP =========================
export const verifyOtp = async (req, res) => {
    const { otp } = req.body;
    // req.userId from user cookies
    const userId = req.userId;
    if(!otp || !userId){
        return res.json({ success: false, message: "otp is required or Invalid input"});
    }
    try {
        const user = await DreemUser.findById(userId);
        if(!user){
            return res.json({ success: false, message: "user not found"});
        }
        if(user.verifyOtp === "" || user.verifyOtp !== otp){
            return res.json({success: false, message: "invalid otp"});
        }
        // verifyOtpExpireAt from user model
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({ success:false, message: "otp expired"})
        }
        user.userIsVerified = true;
        user.verifyOtpExpireAt = null;
        user.verifyOtp = null;

        await user.save();

        return res.json({ success: true, message: "you are verified successfully"});

    } catch (error) {
        return res.json({ success: false, message: error.message});
    }
}
// ===================================== SEND RESET OTP ==========================================
export const sendPasswordResetOtp = async (req, res)=>{
    const { email } = req.body;
    if(!email){
        return res.json({ success: false, message: "email is required"});
    }
    try {
        const user = await DreemUser.findOne({ email: email });
        if(!user){
            return res.json({ success: false, message: "user not found"});
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 1 * 5 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL, // sender address
            to: user.email, // list of recipients
            subject: `your verification otp is: ${otp}`, // subject line
            text: `
              <h1>Acount varification Otp</h1>
            <h3>Your verification code is: ${otp}</h3>
            <p>This code expires in 10 minutes. Do not share it with anyone.</p>
            – [From userAuth app]
            `
        };

        transporter.sendMail(mailOptions);
        return res.json({ success: true, message: "your reset email send successfully"});

    } catch (error) {
        return res.json({ success: false, message: error.message});
    }
}
// ===================================== VERIFY RESET OTP OR SET NEW PASSWORD ========================================
export const verifyandSetResetOtp = async (req, res)=>{
    const { otp, email, newPassword } = req.body;
    const userIp = req.ip
    const userAgent = req.headers['user-agent'];
    if(!otp){
        return res.json({ success: false, message: "otp is required"});
    }
    try {
        const user = await DreemUser.findOne({ email });
        if(!user){
            return res.json({ success: false, message: "user not found"});
        }

        // verify otp
        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({ success: false, message: "otp invalid"});
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({ success: false, message: "Otp expire"});
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedNewPassword;
        user.resetOtp = null;
        user.resetOtpExpireAt = null;

        user.save();

        const parser = new UAParser()
        parser.setUA(userAgent);
        const result = parser.getResult();

        const mailOptions = {
             from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Your password has chenged",
            html: `
                Hello, <br/>
                Your account password was recently changed. <br/>
                
                Details:<br/>
                ---------------------------<br/>
                Device: ${result.device.model} (${result.os.name})<br/>
                Browser: ${result.browser.name}<br/>
                IP Address: ${userIp}<br/>
                Time: ${new Date().toLocaleString('en-US')}<br/>
                ---------------------------<br/>
                
                If you did not make this change, please contact our support team immediately.
            `
        }
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "password reset successfully"});

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
// ======================================= CHECK USER IS AUTHRIZED =====================================
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true, message: "user authrized successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}