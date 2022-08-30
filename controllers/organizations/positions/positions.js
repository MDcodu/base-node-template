
const Positions = require('../../../models/organizations/positions/positions');
const { Op, Sequelize } = require("sequelize");

exports.getPositions = (req, res, next) => {
    Positions.findAll({
        order: [ [ 'updatedAt', 'DESC' ]],
    })
    .then(Positions => { 
        res.status(200).json(Positions);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getPositionFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    Positions.findAll({
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

exports.getPosition = (req, res, next) => {
    const positionId = req.params.positionId;
    Positions.findByPk(positionId)
    .then(position => { 
        res.status(200).json(position);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getPositionsTable = (req, res, next) => {
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

    Positions.findAndCountAll(tableConditions)
    .then(positions => { 
        res.status(200).json(positions);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createPosition = (req, res, next) => {
    Positions.create({
        organizationId: req.body.organizationId,
        costCode: req.body.costCode,
        name: req.body.name,
        description: req.body.description,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(position => { 
        res.status(201).json({
            message: 'Post Success',
            post: position
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updatePosition = (req, res, next) => {
    const positionId = req.params.positionId;
    Positions.findByPk(positionId)
    .then(position => { 
        position.organizationId = req.body.organizationId,
        position.costCode = req.body.costCode,
        position.name = req.body.name,
        position.description = req.body.description,
        position.createdById = req.body.createdById,
        position.createdByName = req.body.createdByName,
        position.updatedById = req.body.updatedById,
        position.updatedByName = req.body.updatedByName
        return position.save();
    })
    .then(position => {
        res.status(201).json({
            message: 'Put Success',
            post: position
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deletePosition = (req, res, next) => {
    const positionId = req.params.positionId;
    Positions.findByPk(positionId)
    .then(position => { 
        return position.destroy();
    })
    .then(position => {
        res.status(201).json({
            message: 'Delete Success',
            post: position
        });
    })
    .catch(err => {
        console.log(err)
    });
};