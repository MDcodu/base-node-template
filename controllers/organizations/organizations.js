
const Organizations = require('../../models/organizations/organizations');
const { Op, Sequelize } = require("sequelize");

exports.getOrganizations = (req, res, next) => {
    Organizations.findAll({
        order: [ [ 'updatedAt', 'DESC' ]],
    })
    .then(Organizations => { 
        res.status(200).json(Organizations);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getOrganizationFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    Organizations.findAll({
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

exports.getOrganization = (req, res, next) => {
    const organizationId = req.params.organizationId;
    Organizations.findByPk(organizationId)
    .then(organization => { 
        res.status(200).json(organization);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getOrganizationsTable = (req, res, next) => {
    const orderBy = [[ 'organizationId', 'DESC' ]];
    // const orderBy = req.body.order? req.body.order : [ [ 'updatedAt', 'DESC' ]];
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

    Organizations.findAndCountAll(tableConditions)
    .then(organizations => { 
        res.status(200).json(organizations);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createOrganization = (req, res, next) => {
    Organizations.create({
        name: req.body.name,
        description: req.body.description,
        industry: req.body.industry,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        logo: req.body.logo,
        accessType: req.body.accessType,
        activeDirectoryUrl: req.body.activeDirectoryUrl,
        reportServerUrl: req.body.reportServerUrl,
        config: req.body.config,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(organization => { 
        res.status(201).json({
            message: 'Post Success',
            post: organization
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateOrganization = (req, res, next) => {
    const organizationId = req.params.organizationId;
    Organizations.findByPk(organizationId)
    .then(organization => { 
        organization.name = req.body.name,
        organization.description = req.body.description,
        organization.industry = req.body.industry,
        organization.address = req.body.address,
        organization.phone = req.body.phone,
        organization.email = req.body.email,
        organization.logo = req.body.logo,
        organization.accessType = req.body.accessType,
        organization.activeDirectoryUrl = req.body.activeDirectoryUrl,
        organization.reportServerUrl = req.body.reportServerUrl,
        organization.config = req.body.config,
        organization.createdById = req.body.createdById,
        organization.createdByName = req.body.createdByName,
        organization.updatedById = req.body.updatedById,
        organization.updatedByName = req.body.updatedByName
        return organization.save();
    })
    .then(organization => {
        res.status(201).json({
            message: 'Put Success',
            post: organization
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteOrganization = (req, res, next) => {
    const organizationId = req.params.organizationId;
    Organizations.findByPk(organizationId)
    .then(organization => { 
        return organization.destroy();
    })
    .then(organization => {
        res.status(201).json({
            message: 'Delete Success',
            post: organization
        });
    })
    .catch(err => {
        console.log(err)
    });
};