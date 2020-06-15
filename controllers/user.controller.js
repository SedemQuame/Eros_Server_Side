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
        name: req.params.name,
        age: 10,
        location: req.params.location,
        profileImg: req.params.image,
        firebaseUID: "",
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
        });
    }).catch(err => {
        res.send({
            err: err
        })
    });
};

exports.addNewPicture = (req, res) => {
    user.findById(req.params.userId)
        .then(doc => {
            doc.mediaList.push({
                assetUrl: req.params.newImgUrl,
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

// todo => optimise function.
exports.deleteExistingAccount = (req, res) => {
    console.log(req.params.userId);
    user.findByIdAndDelete(req.params.userId)
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

// Querying User Accounts
// ======================
exports.getAllUsers = (req, res) => {   
    user.find({})
        .then(docs => {
            docs = docs.filter(doc => {
                return (doc._id != req.params.userId );
            });
            res.send({users: docs});
        }).catch(err => {
            res.send({
                msg: `Unable to fetch user data. Try again later`,
                err: err
            });
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

exports.getUserNotification = (req, res) => {
    user.findById({_id: req.params.userId})
        .then((user) => {
            res.send({
                notifications: user.notifications,
                msg: `Returned all notifications`
            });
        })
        .catch((err) => {
            res.send({
                notifications: [],
                msg: "Failed to return all notifications",
                err: err
            });
        });
};

exports.getUserMediaList = (req, res) => {
    user.findById({_id: req.params.userId})
        .then((user) => {
            res.send({
                mediaList: user.mediaList,
                msg: `Returned all media lists.`
            });
        })
        .catch((err) => {
            res.send({
                mediaList: [],
                msg: "Failed to return media list",
                err: err
            });
        });
};

// Person To Person Requests
// =========================
exports.likePictureOfPossibleMatch = (req, res) => {   
    user.findById({_id: req.params.Id})
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

exports.requestMessageFromPossibleMatch = (req, res) => {   
    user.findById({_id: req.params.requesteeId})
        .then(requestee => {
            // Getting requester details.
            user.findById({_id: req.params.requesteeId})
                .then(requesterInfo => {
                    let msg = `${requesterInfo.name}, sent you a message request.`;
                    requestee.notifications.push({
                        from: req.params.requesterId,
                        subject: msg,
                        requesterImg: requesterInfo.profileImg
                    });
                    requestee.save();
                    res.send({
                        msg: `Successfully requested a message from ${requestee.name}.`
                    });
                }).catch((err) => {
                    res.send({
                        msg: `Unable to request a message from ${requestee.name}.`,
                        err: err
                    });
                });
        }).catch(err => {
            res.send({
                msg: `Unable to request a message from ${requestee.name}.`,
                err: err
            });
        });
};

exports.likePossibleMatch = (req, res) => { 
    // append likeeId to list of liked people.  
    user.findById({_id: req.params.likeeId})
        .then(likee => {
            likee.numberOfLikes++;
            // Getting requester details.
            user.findById({_id: req.params.likerId})
                .then(likerInfo => {
                    let msg = `${likerInfo.name}, likes you.`;
                    likee.notifications.push({
                        from: req.params.likerId,
                        subject: msg,
                        requesterImg: likerInfo.profileImg
                    });
                    likee.save();
                    res.send({
                        msg: `Successfully liked ${likee.name}'s profile.`
                    });
                }).catch((err) => {
                    res.send({
                        msg: `Unable to like ${likee.name}'s profile.`,
                        err: err
                    });
                });
        }).catch(err => {
            res.send({
                msg: `Unable to like ${likee.name}'s profile.`,
                err: err
            });
        });
};

exports.lovePossibleMatch = (req, res) => {   
    user.findById({_id: req.params.loveeId})
        .then(lovee => {
            lovee.numberOfLoves++;
            // Getting requester details.
            user.findById({_id: req.params.loverId})
                .then(loverInfo => {
                    let msg = `${loverInfo.name}, has a crush on you.`;
                    lovee.notifications.push({
                        from: req.params.loverId,
                        subject: msg,
                        requesterImg: loverInfo.profileImg
                    });
                    lovee.save();
                    res.send({
                        msg: `Successfully professed to ${lovee.name}.`
                    });
                }).catch((err) => {
                    res.send({
                        msg: `Unable, to profess to ${lovee.name}. Try again later.`,
                        err: err
                    });
                });
        }).catch(err => {
            res.send({
                msg: `Unable, to profess to ${lovee.name}. Try again later.`,
                err: err
            });
        });
};


// Manipulating Account Assets & Details
// =====================================
exports.deletePicturePostedOnPlatform = (req, res) => {   
    user.findById({_id: req.params.userId})
        .then(doc => {

        let mediaList = doc.mediaList;
        console.log(`Unchanged: ${mediaList}`);
            
        mediaList = _.remove(mediaList, (media) => {
            return (media[`_id`] != req.params.pictureImgId);
        });

        console.log(`Changed: ${mediaList}`);

        doc.mediaList = mediaList;

        doc.save();
        // todo: write server side code for deleting the picture
        // on the storage platform.
        
        res.send({
                msg: `Image Deleted.`,
                doc: mediaList
        });
        }).catch(err => {
            res.send({
                msg: `Unable to delete Image.`,
                err: err
            });
        });
};

exports.modifyUserName = (req, res) => {   
    user.findById({_id: req.params.Id})
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
    user.findById({_id: req.params.Id})
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
    user.findById({_id: req.params.userId})
        .then(doc => {
            doc.profileImg = req.params.newProfilePictureUrl;
            doc.save();
            res.send({
                msg: `Successfully changed profile picture.`
            });
        })
        .catch(err => {
            res.send({
                msg: `Unable to change profile picture.`,
                err: err
            });
        });
};

exports.modifyPreferences = (req, res) => {   
    user.findById({_id: req.params.Id})
        .then(doc => {

        })
        .catch();
};

exports.modifySocialBackground = (req, res) => {   
    user.findById({_id: req.params.Id})
        .then(doc => {

        })
        .catch();
};