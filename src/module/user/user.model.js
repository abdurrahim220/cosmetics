"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ["super-admin", "admin", "seller", "buyer"],
        default: "buyer",
    },
    status: {
        type: String,
        enum: ["in-progress", "blocked", "active"],
        default: "in-progress",
    },
    addresses: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Address", default: [] }],
    products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Product", default: [] }],
    banners: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Banner", default: [] }],
    orders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Order", default: [] }],
    wishlist: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Wishlist", default: [] }],
    otp: {
        type: Number,
    },
    otpExpiresAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    },
    accessToken: {
        type: String,
    },
    passwordChangedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        try {
            this.password = yield bcrypt_1.default.hash(this.password, 12);
            if (!this.isNew) {
                this.passwordChangedAt = new Date();
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
userSchema.statics.isUserExistsByCustomId = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ id }).select("+password");
    });
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};
exports.User = (0, mongoose_1.model)("User", userSchema);
