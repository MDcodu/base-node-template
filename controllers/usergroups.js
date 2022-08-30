const UserGroups = require('../models/usergroups');

exports.getUserGroups = (req, res, next) => {
    UserGroups.findAll()
    .then(userGroups => { 
        res.status(200).json(userGroups);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getUserGroup = (req, res, next) => {
    const userGroupId = req.params.userGroupId;
    UserGroups.findByPk(userGroupId)
    .then(userGroup => { 
        res.status(200).json(userGroup);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createUserGroup = (req, res, next) => {
    UserGroups.create({
        userId: req.body.userId,
        dataName: req.body.dataName,
        jsonData: req.body.jsonData,
        modifiedBy: req.body.modifiedBy,
        inputBy: req.body.inputBy
    })
    .then(userGroup => { 
        res.status(201).json({
            message: 'Post Success',
            post: userGroup
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateUserGroup = (req, res, next) => {
    const userGroupId = req.params.userGroupId;
    UserGroups.findByPk(userGroupId)
    .then(userGroup => { 
        userGroup.userId = req.body.userId,
        userGroup.dataName = req.body.dataName,
        userGroup.jsonData = req.body.jsonData,
        userGroup.modifiedBy = req.body.modifiedBy
        return userGroup.save();
    })
    .then(userGroup => {
        res.status(201).json({
            message: 'Put Success',
            post: userGroup
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteUserGroup = (req, res, next) => {
    const userGroupId = req.params.userGroupId;
    UserGroups.findByPk(userGroupId)
    .then(userGroup => { 
        return userGroup.destroy();
    })
    .then(userGroup => {
        res.status(201).json({
            message: 'Delete Success',
            post: userGroup
        });
    })
    .catch(err => {
        console.log(err)
    });
};