const UserSupervisors = require('../../../models/users/user-supervisors/user-supervisors');

exports.getUserSupervisors = (req, res, next) => {
    UserSupervisors.findAll()
    .then(userSupervisors => { 
        res.status(200).json(userSupervisors);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getUserSupervisor = (req, res, next) => {
    const userSupervisorId = req.params.userSupervisorId;
    UserSupervisors.findByPk(userSupervisorId)
    .then(userSupervisor => { 
        res.status(200).json(userSupervisor);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getUserSupervisorTable = (req, res, next) => {
    const orderBy = req.body.order? req.body.order : [ [ 'userSupervisorId', 'DESC' ]];
    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    if (whereCondition.userId) {
        Object.assign(tableConditions, {where: whereCondition});
    }
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions, {limit: req.body.limit});
    Object.assign(tableConditions, {offset: req.body.offset});
    for (let i = 0; objKeys.length > i; i++) {
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'text') {
            const textFilterObj = {[Op.like]: `%${whereCondition[objKeys[i]].value}%`};
            Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj})
        } 
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'number') {
            const textFilterObj = {[Op.like]: `%${whereCondition[objKeys[i]].value}%`};
            Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj})
        } 
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'date') {
            if (whereCondition[objKeys[i]].dateFilter) {
                const textFilterObj = {[Op.and]: [
                    { [Op.gte]: new Date(whereCondition[objKeys[i]].dateFilter.dateFrom).setUTCHours(0,0,0,0) + (3600 * 1000 * 24)} , 
                    { [Op.lte]: new Date(whereCondition[objKeys[i]].dateFilter.dateTo).setUTCHours(23,59,59,999) + (3600 * 1000 * 24)} 
                ]};
                Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj})
            }
        } 
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'array') {
            if (whereCondition[objKeys[i]].arrayFilter) {
                if (!whereCondition[objKeys[i]].arrayFilter.value) {
                    const textFilterObj = {[objKeys[i]]: {name: whereCondition[objKeys[i]].arrayFilter.name } };
                    Object.assign(tableConditions.where, textFilterObj)
                } else {
                    const textFilterObj = {[objKeys[i]]: {value: { name: whereCondition[objKeys[i]].arrayFilter.value.name} } };
                    Object.assign(tableConditions.where, textFilterObj)
                }
            }
        } 
    }
    UserSupervisors.findAndCountAll(tableConditions)
    .then(userSupervisors => { 
        res.status(200).json(userSupervisors);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getUserSupervisorUser = (req, res, next) => {
    const whereCondition = req.body.whereCondition;
    UserSupervisors.findAll(whereCondition)
    .then(userSupervisors => { 
        res.status(200).json(userSupervisors);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createUserSupervisor = (req, res, next) => {
    UserSupervisors.create({
        userId: req.body.userId,
        supervisorId: req.body.supervisorId,
        companyId: req.body.companyId,
        nationalId: req.body.nationalId,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(userSupervisor => { 
        res.status(201).json({
            message: 'Post Success',
            post: userSupervisor
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateUserSupervisor = (req, res, next) => {
    const userSupervisorId = req.params.userSupervisorId;
    UserSupervisors.findByPk(userSupervisorId)
    .then(userSupervisor => { 
        userSupervisor.userId = req.body.userId,
        userSupervisor.supervisorId = req.body.supervisorId,
        userSupervisor.companyId = req.body.companyId,
        userSupervisor.nationalId = req.body.nationalId,
        userSupervisor.firstName = req.body.firstName,
        userSupervisor.middleName = req.body.middleName,
        userSupervisor.lastName = req.body.lastName,
        userSupervisor.createdById = req.body.createdById,
        userSupervisor.createdByName = req.body.createdByName,
        userSupervisor.updatedById = req.body.updatedById,
        userSupervisor.updatedByName = req.body.updatedByName
        return userSupervisor.save();
    })
    .then(userSupervisor => {
        res.status(201).json({
            message: 'Put Success',
            post: userSupervisor
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteUserSupervisor = (req, res, next) => {
    const userSupervisorId = req.params.userSupervisorId;
    UserSupervisors.findByPk(userSupervisorId)
    .then(userSupervisor => { 
        return userSupervisor.destroy();
    })
    .then(userSupervisor => {
        res.status(201).json({
            message: 'Delete Success',
            post: userSupervisor
        });
    })
    .catch(err => {
        console.log(err)
    });
};