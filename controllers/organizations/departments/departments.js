
const Departments = require('../../../models/organizations/departments/departments');
const { Op, Sequelize } = require("sequelize");

exports.getDepartments = (req, res, next) => {
    Departments.findAll({
        order: [ [ 'updatedAt', 'DESC' ]],
    })
    .then(Departments => { 
        res.status(200).json(Departments);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getDepartmentFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    Departments.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col(`${fieldName}`)) ,'choices'],
        ]
    })
    .then(choices => { 
        res.status(200).json(choices);
    })
    .catch(err => {
        console.log(err)
    });
}

exports.getDepartment = (req, res, next) => {
    const departmentId = req.params.departmentId;
    Departments.findByPk(departmentId)
    .then(department => { 
        res.status(200).json(department);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getDepartmentsTable = (req, res, next) => {
    const orderBy = req.body.order? req.body.order : [ [ 'updatedAt', 'DESC' ]];
    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
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
            if (!whereCondition[objKeys[i]].arrayFilter.value) {
                const textFilterObj = {[objKeys[i]]: {name: whereCondition[objKeys[i]].arrayFilter.name } };
                Object.assign(tableConditions.where, textFilterObj)
            } else {
                const textFilterObj = {[objKeys[i]]: {value: { name: whereCondition[objKeys[i]].arrayFilter.value.name} } };
                Object.assign(tableConditions.where, textFilterObj)
            }
        } 
    }

    Departments.findAndCountAll(tableConditions)
    .then(departments => { 
        res.status(200).json(departments);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createDepartment = (req, res, next) => {
    Departments.create({
        organizationId: req.body.organizationId,
        costCode: req.body.costCode,
        name: req.body.name,
        description: req.body.description,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(department => { 
        res.status(201).json({
            message: 'Post Success',
            post: department
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateDepartment = (req, res, next) => {
    const departmentId = req.params.departmentId;
    Departments.findByPk(departmentId)
    .then(department => { 
        department.organizationId = req.body.organizationId,
        department.costCode = req.body.costCode,
        department.name = req.body.name,
        department.description = req.body.description,
        department.createdById = req.body.createdById,
        department.createdByName = req.body.createdByName,
        department.updatedById = req.body.updatedById,
        department.updatedByName = req.body.updatedByName
        return department.save();
    })
    .then(department => {
        res.status(201).json({
            message: 'Put Success',
            post: department
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteDepartment = (req, res, next) => {
    const departmentId = req.params.departmentId;
    Departments.findByPk(departmentId)
    .then(department => { 
        return department.destroy();
    })
    .then(department => {
        res.status(201).json({
            message: 'Delete Success',
            post: department
        });
    })
    .catch(err => {
        console.log(err)
    });
};