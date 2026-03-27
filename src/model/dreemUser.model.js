import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        verifyOtp: {
            type: String,
            default: null,
        },
        verifyOtpExpireAt: {
            type: Date,
            default: null,
        },
        userIsVerified: {
            type: Boolean,
            default: false,
        },
        resetOtp: {
            type: String,
            default: null,
        },
        resetOtpExpireAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const DreemUser = mongoose.model('DreemUser', userSchema);

export default DreemUser;