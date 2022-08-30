const Interfaces = require('../models/interfaces');
const { Op, Sequelize } = require("sequelize");

exports.getInterfaces = (req, res, next) => {
    Interfaces.findAll()
    .then(interfaces => { 
        res.status(200).json(interfaces);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getInterfaceFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    console.log(fieldName)
    Interfaces.findAll({
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

exports.getInterfacesTable = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const orderBy = [[ 'interfaceId', 'DESC' ]];
    // const orderBy = req.body.order? req.body.order : [ [ 'updatedAt', 'DESC' ]];
    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions, {limit: req.body.limit});
    Object.assign(tableConditions, {offset: req.body.offset});
    Object.assign(tableConditions.where, {organizationId: organizationId});
    if (parseInt(systemId) !== 0) {
        Object.assign(tableConditions.where, {systemId: systemId});
    } 
    else {
        delete tableConditions.where[systemId]; 
    }
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

    Interfaces.findAndCountAll(tableConditions)
    .then(interfaces => { 
        res.status(200).json(interfaces);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getInterface = (req, res, next) => {
    const interfaceId = req.params.interfaceId;
    Interfaces.findByPk(interfaceId)
    .then(interface => { 
        res.status(200).json(interface);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getInterfacesByOrganizationSystem = (req, res, next) => {
    const organizationId = req.params.organizationId;
    const systemId = req.params.systemId;
    Interfaces.findAll({
        where: { 
            organizationId: organizationId,
            systemId: systemId
        },
        order: [ [ 'interfaceId', 'DESC' ]],
    })
    .then(interfaces => { 
        res.status(200).json(interfaces);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createInterface = (req, res, next) => {
    Interfaces.create({
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        name: req.body.name,
        description: req.body.description,
        icon: req.body.icon,
        config: req.body.config,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(interface => { 
        res.status(201).json({
            message: 'Post Success',
            post: interface
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateInterface = (req, res, next) => {
    const interfaceId = req.params.interfaceId;
    Interfaces.findByPk(interfaceId)
    .then(interface => { 
        interface.systemId = req.body.systemId,
        interface.organizationId = req.body.organizationId,
        interface.name = req.body.name,
        interface.description = req.body.description,
        interface.icon = req.body.icon,
        interface.config = req.body.config,
        interface.createdById = req.body.createdById,
        interface.createdByName = req.body.createdByName,
        interface.updatedById = req.body.updatedById,
        interface.updatedByName = req.body.updatedByName
        return interface.save();
    })
    .then(interface => {
        res.status(201).json({
            message: 'Put Success',
            post: interface
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteInterface = (req, res, next) => {
    const interfaceId = req.params.interfaceId;
    Interfaces.findByPk(interfaceId)
    .then(interface => { 
        return interface.destroy();
    })
    .then(interface => {
        res.status(201).json({
            message: 'Delete Success',
            post: interface
        });
    })
    .catch(err => {
        console.log(err)
    });
};