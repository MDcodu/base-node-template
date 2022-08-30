
const Nationalities = require('../../../models/organizations/nationalities/nationalities');
const { Op, Sequelize } = require("sequelize");

exports.getNationalities = (req, res, next) => {
    Nationalities.findAll({
        order: [ [ 'updatedAt', 'DESC' ]],
    })
    .then(Nationalities => { 
        res.status(200).json(Nationalities);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getNationalityFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    Nationalities.findAll({
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

exports.getNationality = (req, res, next) => {
    const nationalityId = req.params.nationalityId;
    Nationalities.findByPk(nationalityId)
    .then(nationality => { 
        res.status(200).json(nationality);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getNationalitiesTable = (req, res, next) => {
    const orderBy = req.body.order? req.body.order : [[ 'updatedAt', 'DESC' ]];
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

    Nationalities.findAndCountAll(tableConditions)
    .then(nationalities => { 
        res.status(200).json(nationalities);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createNationality = (req, res, next) => {
    Nationalities.create({
        organizationId: req.body.organizationId,
        costCode: req.body.costCode,
        name: req.body.name,
        description: req.body.description,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(nationality => { 
        res.status(201).json({
            message: 'Post Success',
            post: nationality
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateNationality = (req, res, next) => {
    const nationalityId = req.params.nationalityId;
    Nationalities.findByPk(nationalityId)
    .then(nationality => { 
        nationality.organizationId = req.body.organizationId,
        nationality.costCode = req.body.costCode,
        nationality.name = req.body.name,
        nationality.description = req.body.description,
        nationality.createdById = req.body.createdById,
        nationality.createdByName = req.body.createdByName,
        nationality.updatedById = req.body.updatedById,
        nationality.updatedByName = req.body.updatedByName
        return nationality.save();
    })
    .then(nationality => {
        res.status(201).json({
            message: 'Put Success',
            post: nationality
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteNationality = (req, res, next) => {
    const nationalityId = req.params.nationalityId;
    Nationalities.findByPk(nationalityId)
    .then(nationality => { 
        return nationality.destroy();
    })
    .then(nationality => {
        res.status(201).json({
            message: 'Delete Success',
            post: nationality
        });
    })
    .catch(err => {
        console.log(err)
    });
};