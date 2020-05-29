// jshint esversion:6
// ================================ creating list application route ===================================//
const user = require(`../controllers/user.controller`);

module.exports = app => {

    app.all(`/defaultDisplay`, (req,res) => {
            res.send({msg: `Eros Server Side.`});
        });

//     //========================================== app users routes ============================================//
    app.route(`/createNewUserAccount/userName/:name/aboutMe/:bio.:views/preferences/:gender.:ageRange.:lookingFor/socialBackground/:work.:religion.:school/contactInformation/:email.:phone`)
       .post(user.createNewUserAccount);

    app.route(`/addNewPicture`)
       .post(user.addNewPicture);

    app.route(`/deleteExistingAccount/userDocId/:id`)
        .post(user.deleteExistingAccount);

// ==================================================
    app.route(`/getAllUsers`)
        .post(user.getAllUsers);

    app.route(`/getAllUsersWithMatchingPreferences`)
        .post(user.getAllUsersWithMatchingPreferences);

// ==================================================
    app.route(`/requestMessageFromPossibleMatch`)
        .post(user.requestMessageFromPossibleMatch);

    app.route(`/likePictureOfPossibleMatch`)
        .post(user.likePictureOfPossibleMatch);
        
    app.route(`/deletePicturePostedOnPlatform`)
        .post(user.deletePicturePostedOnPlatform);

// ==================================================
// Modifying User Attributes.
    app.route(`/modifyUserName`)
        .post(user.modifyUserName);

    app.route(`/modifyContactDetails`)
        .post(user.modifyContactDetails);

    app.route(`/changeProfileImg`)
        .post(user.changeProfileImg);

    app.route(`/modifyPreferences`)
        .post(user.modifyPreferences);

    app.route(`/modifySocialBackground`)
        .post(user.modifySocialBackground);
};
