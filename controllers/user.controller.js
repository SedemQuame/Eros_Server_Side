// jshint esversion:6
// require('dotenv').config({ path: __dirname + './../.env' });

//====================================== requiring modules ===========================================//
// node modules
// Load the full build.
const _ = require('lodash');

// custom models
const user = require(`../models/user.models`).user;
const preferences = require(`../models/user.models`).preferences;


//================================== creating HTTP handler methods ==================================//

// Creating & Deleting User Accounts.
// ==================================
// todo => optimise function.
exports.createNewUserAccount = (req, res) => {   
    user.create({
        name: `John Doe`,
        age: 10,
        aboutMe: {
            bio: req.params.bio,
            views: req.params.views,
        },
        preferences: {
            gender: req.params.gender,
            lookingFor: req.params.lookingFor,
            ageRange: req.params.ageRange,
        },
        socialBackground: {
            work: req.params.work,
            school: req.params.school,
            religion: req.params.religion,
        },
        contactInformation: {
            emailAddress: req.params.email,
            phoneNumber: req.params.phone,
        }
    }).then( docs => {
        res.send({
            msg: `Successfully created user account.`,
            // return id of user's mongo collection.
            _id: docs._id,
        })
    }).catch(err => {
        res.send({
            err: err
        })
    });
};

// todo => optimise function.
exports.deleteExistingAccount = (req, res) => {
    console.log(req.params.id);
    user.findByIdAndDelete(req.params.id)
        .then(
            res.send({
                msg: `Successfully deleted`
            })
        ).catch(
            res.send({
                msg: `Unable to successfully delete account.`
            })            
        );
};

exports.addNewPicture = (req, res) => {
    user.findById(`5ec38afd28d1071be8bb19d8`)
        .then(doc => {
            doc.mediaList.push({
                assetUrl: `https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`,
                assetType: `Image`,
                numberOfLikes: 0
            });
            doc.save();
            res.send({msg: `Successfully added a new Image.`});
        }).catch(
            err => {
                res.send({
                    msg: `Unable to add new picture.`,
                    err: err
                });
            }
        );
};

// Querying User Accounts
// ======================
// todo => optimise function.
exports.getAllUsers = (req, res) => {   
    user.find({})
        .then(docs => {
            res.send({users: docs});
        }).catch(err => {
            res.send({msg: `Unable fetch user data. Try again later`})
        });
};

// todo => pass field data into function
exports.getAllUsersWithMatchingPreferences = (req, res) => {
    user.find({
        'preferences.lookingFor': 'female'
    }).where('age').gte(25).lte(38)
        .then(docs => {
            console.log(docs);
            res.send({preferences: docs.filter(doc => doc.preferences.lookingFor == 'male')})
        }).catch(err => {
            console.log(err);
        });
};

// Person To Person Requests
// =========================
exports.requestMessageFromPossibleMatch = (req, res) => {   
    user.findById({_id: `5ec38b5128d1071be8bb19e2`})
        .then(doc => {
            doc.notifications.push({
                from: `5ec38b7828d1071be8bb19ec`,
                subject: `Love profession then things.`,
            });
            doc.save();
            res.send({
                msg: `Successfully added request to queue.`
            });
        }).catch(err => {
            res.send({
                msg: `Unable to request message from user.`,
                err: err
            });
        });
};

exports.likePictureOfPossibleMatch = (req, res) => {   
    user.findById({_id: `5ec38afd28d1071be8bb19d8`})
        .then(doc => {
           doc.mediaList.map(
               media => {
                   if(media[`_id`] == `5ec3a556f9d0142890737bbe`){
                       console.log(media.numberOfLikes);
                       media.numberOfLikes = media.numberOfLikes + 1;
                   }
               }
           );
           doc.save();
           res.send({
                msg: `Like Recorded`
           });
        }).catch(err => {
            res.send({
                msg: `Unable to like Image.`,
                err: err
            });
        });
};


// Manipulating Account Assets & Details
// =====================================
exports.deletePicturePostedOnPlatform = (req, res) => {   
    user.findById({_id: `5ec38afd28d1071be8bb19d8`})
        .then(doc => {
        _.remove(doc.mediaList, (media) => {
            return (media[`_id`] == `5ec3a556f9d0142890737bbe`);
        });
        // doc.save();
        console.log(doc);

        // todo: write server side code for deleting the picture
        // on the storage platform.
        
        res.send({
                msg: `Image Deleted.`
        });
        }).catch(err => {
            res.send({
                msg: `Unable to delete Image.`,
                err: err
            });
        });
};

exports.modifyUserName = (req, res) => {   
    user.findById({_id: `5ec38afd28d1071be8bb19d8`})
        .then(doc => {
            doc.name = 'New name';
            doc.save();
            res.send({
                msg: `Successfully changed user name.`
            });
        }).catch(err => {
            res.send({
                msg: `Unable to change user name.`,
                err: err
            });
        });
};

exports.modifyContactDetails = (req, res) => {   
    user.findById({_id: `5ec38afd28d1071be8bb19d8`})
        .then(doc => {
            doc.contactInformation.phoneNumber = 'New Phone Number';
            doc.save();
            res.send({
                msg: `Successfully changed phone number.`
            });
        }).catch(err => {
            res.send({
                msg: `Unable to change phone number.`,
                err: err
            });
        });
};

exports.changeProfileImg = (req, res) => {   
    user.findById({_id: `5ec38afd28d1071be8bb19d8`})
        .then(doc => {

        })
        .catch();
};

exports.modifyPreferences = (req, res) => {   
    user.findById({_id: `5ec38afd28d1071be8bb19d8`})
        .then(doc => {

        })
        .catch();
};

exports.modifySocialBackground = (req, res) => {   
    user.findById({_id: `5ec38afd28d1071be8bb19d8`})
        .then(doc => {

        })
        .catch();
};