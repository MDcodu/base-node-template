
const Apis = require('../../../models/organizations/apis/apis');
const { Op, Sequelize } = require("sequelize");

exports.getApis = (req, res, next) => {
    Apis.findAll({
        order: [ [ 'updatedAt', 'DESC' ]],
    })
    .then(Apis => { 
        res.status(200).json(Apis);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getApiFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    Apis.findAll({
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

exports.getApi = (req, res, next) => {
    const apiId = req.params.apiId;
    Apis.findByPk(apiId)
    .then(api => { 
        res.status(200).json(api);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getApisObjectChoice = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const orderBy = req.body.order? req.body.order : [ [ 'updatedAt', 'DESC' ]];

    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions.where, 
        {organizationId: organizationId});

    Apis.findAll(tableConditions)
    .then(apis => { 
        res.status(200).json(apis);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getApisTable = (req, res, next) => {
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

    Apis.findAndCountAll(tableConditions)
    .then(apis => { 
        res.status(200).json(apis);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createApi = (req, res, next) => {
    Apis.create({
        organizationId: req.body.organizationId,
        costCode: req.body.costCode,
        name: req.body.name,
        label: req.body.label,
        description: req.body.description,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(api => { 
        res.status(201).json({
            message: 'Post Success',
            post: api
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateApi = (req, res, next) => {
    const apiId = req.params.apiId;
    Apis.findByPk(apiId)
    .then(api => { 
        api.organizationId = req.body.organizationId,
        api.costCode = req.body.costCode,
        api.name = req.body.name,
        api.label = req.body.label,
        api.description = req.body.description,
        api.config = req.body.config,
        api.createdById = req.body.createdById,
        api.createdByName = req.body.createdByName,
        api.updatedById = req.body.updatedById,
        api.updatedByName = req.body.updatedByName
        return api.save();
    })
    .then(api => {
        res.status(201).json({
            message: 'Put Success',
            post: api
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteApi = (req, res, next) => {
    const apiId = req.params.apiId;
    Apis.findByPk(apiId)
    .then(api => { 
        return api.destroy();
    })
    .then(api => {
        res.status(201).json({
            message: 'Delete Success',
            post: api
        });
    })
    .catch(err => {
        console.log(err)
    });
};