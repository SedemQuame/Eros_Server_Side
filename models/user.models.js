//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');

// ==================================== creating database schema=======================================//
const aboutMeSchema = mongoose.Schema({
    bio: { type: String},
    views: { type: String},
});

const socialBackgroundSchema = mongoose.Schema({
    work: {type: String},
    school: {type: String},
    religion: {type: String},
});

const contactInformationSchema = mongoose.Schema({
    emailAddress: {type: String},
    phoneNumber: {type: String},
});

const preferenceSchema = mongoose.Schema({
    gender: {type: String},
    lookingFor: {type: String},
    ageRange: {type: String},
});

const media = mongoose.Schema({
    assetUrl: {type: String},
    assetType: {type: String},
    numberOfLikes: {type: Number, default: 0}
});

const notificationSchema = mongoose.Schema({
    from: {type: String},
    subject: {type: String},
    date: { type: Date, default: Date.now },
});


// Creating the user schema, using the above documents as a sub-schema.
const userSchema = mongoose.Schema({
    // personal information
    name: {type: String},
    age: {type: Number},
    profileImg: {type: String},
    firebaseUID: {type: String},
    aboutMe: aboutMeSchema,
    preferences: preferenceSchema,
    socialBackground: socialBackgroundSchema,
    contactInformation: contactInformationSchema,
    mediaList: [media],
    notifications: [notificationSchema],
});

// exporting user schema.
module.exports = {
    user: mongoose.model('user', userSchema),
    // preferences: mongoose.model('preferences', userSchema.preferenceSchema),
    userSchema: userSchema
};
