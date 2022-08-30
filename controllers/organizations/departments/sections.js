
const Sections = require('../../../models/organizations/departments/sections');
const { Op, Sequelize } = require("sequelize");

exports.getSections = (req, res, next) => {
    Sections.findAll({
        order: [ [ 'updatedAt', 'DESC' ]],
    })
    .then(Sections => { 
        res.status(200).json(Sections);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getSectionFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    Sections.findAll({
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

exports.getSection = (req, res, next) => {
    const sectionId = req.params.sectionId;
    Sections.findByPk(sectionId)
    .then(section => { 
        res.status(200).json(section);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getSectionsTable = (req, res, next) => {
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

    Sections.findAndCountAll(tableConditions)
    .then(sections => { 
        res.status(200).json(sections);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createSection = (req, res, next) => {
    Sections.create({
        organizationId: req.body.organizationId,
        costCode: req.body.costCode,
        name: req.body.name,
        description: req.body.description,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(section => { 
        res.status(201).json({
            message: 'Post Success',
            post: section
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateSection = (req, res, next) => {
    const sectionId = req.params.sectionId;
    Sections.findByPk(sectionId)
    .then(section => { 
        section.organizationId = req.body.organizationId,
        section.costCode = req.body.costCode,
        section.name = req.body.name,
        section.description = req.body.description,
        section.createdById = req.body.createdById,
        section.createdByName = req.body.createdByName,
        section.updatedById = req.body.updatedById,
        section.updatedByName = req.body.updatedByName
        return section.save();
    })
    .then(section => {
        res.status(201).json({
            message: 'Put Success',
            post: section
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteSection = (req, res, next) => {
    const sectionId = req.params.sectionId;
    Sections.findByPk(sectionId)
    .then(section => { 
        return section.destroy();
    })
    .then(section => {
        res.status(201).json({
            message: 'Delete Success',
            post: section
        });
    })
    .catch(err => {
        console.log(err)
    });
};