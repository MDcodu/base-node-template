const Systems = require('../models/systems');
const { Op, Sequelize } = require("sequelize");

exports.getSystems = (req, res, next) => {
    Systems.findAll()
    .then(systems => { 
        res.status(200).json(systems);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getSystemFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    Systems.findAll({
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

exports.getSystemsTable = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const orderBy = [[ 'systemId', 'DESC' ]];

    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions, {limit: req.body.limit});
    Object.assign(tableConditions, {offset: req.body.offset});
    Object.assign(tableConditions.where, {organizationId: organizationId});
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

    Systems.findAndCountAll(tableConditions)
    .then(systems => { 
        res.status(200).json(systems);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getSystem = (req, res, next) => {
    const systemId = req.params.systemId;
    Systems.findByPk(systemId)
    .then(system => { 
        res.status(200).json(system);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getSystemByOrganization = (req, res, next) => {
    const organizationId = req.params.organizationId;
    Systems.findAll({
        where: { organizationId: organizationId},
        order: [ [ 'createdAt', 'DESC' ]],
    })
    .then(system => { 
        res.status(200).json(system);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createSystem = (req, res, next) => {
    Systems.create({
        organizationId: req.body.organizationId,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        theme: req.body.theme,
        logo: req.body.logo,
        config: req.body.config,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(system => { 
        res.status(201).json({
            message: 'Post Success',
            post: system
        });
    })
    .catch(err => { 
        console.log(err);
        res.status(400).send({
            message: 'This is an error!'
         });
    });
};

exports.updateSystem = (req, res, next) => {
    const systemId = req.params.systemId;
    Systems.findByPk(systemId)
    .then(system => { 
        system.organizationId = req.body.organizationId,
        system.name = req.body.name,
        system.description = req.body.description,
        system.type = req.body.type,
        system.logo = req.body.logo,
        system.config = req.body.config,
        system.createdById = req.body.createdById,
        system.createdByName = req.body.createdByName,
        system.updatedById = req.body.updatedById,
        system.updatedByName = req.body.updatedByName
        return system.save();
    })
    .then(system => {
        res.status(201).json({
            message: 'Put Success',
            post: system
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteSystem = (req, res, next) => {
    const systemId = req.params.systemId;
    Systems.findByPk(systemId)
    .then(system => { 
        return system.destroy();
    })
    .then(system => {
        res.status(201).json({
            message: 'Delete Success',
            post: system
        });
    })
    .catch(err => {
        console.log(err)
    });
};