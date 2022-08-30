
const GroupRoles = require('../models/grouproles');

exports.getGroupRoles = (req, res, next) => {
    GroupRoles.findAll()
    .then(groupRoles => { 
        res.status(200).json(groupRoles);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getGroupRole = (req, res, next) => {
    const groupRoleId = req.params.groupRoleId;
    GroupRoles.findByPk(groupRoleId)
    .then(groupRole => { 
        res.status(200).json(groupRole);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createGroupRole = (req, res, next) => {
    GroupRoles.create({
        groupId: req.body.groupId,
        dataName: req.body.dataName,
        jsonData: req.body.jsonData,
        modifiedBy: req.body.modifiedBy,
        inputBy: req.body.inputBy
    })
    .then(groupRole => { 
        res.status(201).json({
            message: 'Post Success',
            post: groupRole
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateGroupRole = (req, res, next) => {
    const groupRoleId = req.params.groupRoleId;
    GroupRoles.findByPk(groupRoleId)
    .then(groupRole => { 
        groupRole.groupId = req.body.groupId,
        groupRole.dataName = req.body.dataName,
        groupRole.jsonData = req.body.jsonData,
        groupRole.modifiedBy = req.body.modifiedBy
        return groupRole.save();
    })
    .then(groupRole => {
        res.status(201).json({
            message: 'Put Success',
            post: groupRole
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteGroupRole = (req, res, next) => {
    const groupRoleId = req.params.groupRoleId;
    GroupRoles.findByPk(groupRoleId)
    .then(groupRole => { 
        return groupRole.destroy();
    })
    .then(groupRole => {
        res.status(201).json({
            message: 'Delete Success',
            post: groupRole
        });
    })
    .catch(err => {
        console.log(err)
    });
};