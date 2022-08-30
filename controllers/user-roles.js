const UserRoles = require('../models/user-roles');

exports.getUserRoles = (req, res, next) => {
    UserRoles.findAll()
    .then(userRoles => { 
        res.status(200).json(userRoles);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getUserRole = (req, res, next) => {
    const userRoleId = req.params.userRoleId;
    UserRoles.findByPk(userRoleId)
    .then(userRole => { 
        res.status(200).json(userRole);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createUserRole = (req, res, next) => {
    UserRoles.create({
        userId: req.body.userId,
        groupId: req.body.groupId,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(userRole => { 
        res.status(201).json({
            message: 'Post Success',
            post: userRole
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateUserRole = (req, res, next) => {
    const userRoleId = req.params.userRoleId;
    UserRoles.findByPk(userRoleId)
    .then(userRole => { 
        userRole.userId = req.body.userId,
        userRole.groupId = req.body.groupId,
        userRole.createdById = req.body.createdById,
        userRole.createdByName = req.body.createdByName,
        userRole.updatedById = req.body.updatedById,
        userRole.updatedByName = req.body.updatedByName
        return userRole.save();
    })
    .then(userRole => {
        res.status(201).json({
            message: 'Put Success',
            post: userRole
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteUserRole = (req, res, next) => {
    const userRoleId = req.params.userRoleId;
    UserRoles.findByPk(userRoleId)
    .then(userRole => { 
        return userRole.destroy();
    })
    .then(userRole => {
        res.status(201).json({
            message: 'Delete Success',
            post: userRole
        });
    })
    .catch(err => {
        console.log(err)
    });
};