const StepRules = require('../../models/steps/step-rules');
const { Op, Sequelize } = require("sequelize");

exports.getStepRules = (req, res, next) => {
    StepRules.findAll()
    .then(stepRules => { 
        res.status(200).json(stepRules);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getStepRuleFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    StepRules.findAll({
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

exports.getStepRulesTable = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const stepId = req.body.stepId;
    const orderBy = [[ 'stepRuleId', 'DESC' ]];

    const whereCondition = req.body.whereCondition;

    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions, {limit: req.body.limit});
    Object.assign(tableConditions, {offset: req.body.offset});
    Object.assign(tableConditions.where, 
        {organizationId: organizationId}, 
        {systemId: systemId}, 
        {interfaceId: interfaceId},
        {stepId: stepId});
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

    StepRules.findAndCountAll(tableConditions)
    .then(stepRules => { 
        res.status(200).json(stepRules);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getStepRule = (req, res, next) => {
    const stepRuleId = req.params.stepRuleId;
    StepRules.findByPk(stepRuleId)
    .then(stepRule => { 
        res.status(200).json(stepRule);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getStepRuleByOrganization = (req, res, next) => {
    const organizationId = req.params.organizationId;
    StepRules.findAll({
        where: { organizationId: organizationId},
        order: [ [ 'createdAt', 'DESC' ]],
    })
    .then(stepRule => { 
        res.status(200).json(stepRule);
    })
    .catch(err => {
        console.log(err);
    });
};

exports.createStepRule = async(req, res, next) => {
    let stepRuleData;
    await StepRules.create({
        stepId: req.body.stepId,
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        position: req.body.position,
        name: req.body.name,
        description: req.body.description,
        config: req.body.config,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(stepRule => { 
        stepRuleData = stepRule;
        res.status(201).json({
            message: 'Post Success',
            post: stepRule
        });
    })
    .catch(err => { 
        console.log(err);
        res.status(400).send({
            message: 'This is an error!'
         });
    });

    StepRules.findByPk(stepRuleData.stepRuleId)
    .then(stepRule => { 
        stepRule.stepId = req.body.stepId,
        stepRule.interfaceId = req.body.interfaceId,
        stepRule.systemId = req.body.systemId,
        stepRule.organizationId = req.body.organizationId,
        stepRule.position = stepRuleData.stepRuleId,    
        stepRule.name = req.body.name,
        stepRule.description = req.body.description,
        stepRule.config = req.body.config,
        stepRule.createdById = req.body.createdById,
        stepRule.createdByName = req.body.createdByName,
        stepRule.updatedById = req.body.updatedById,
        stepRule.updatedByName = req.body.updatedByName
        return stepRule.save();
    });
};

exports.updateStepRule = (req, res, next) => {
    const stepRuleId = req.params.stepRuleId;
    StepRules.findByPk(stepRuleId)
    .then(stepRule => { 
        stepRule.interfaceId = req.body.interfaceId,
        stepRule.systemId = req.body.systemId,
        stepRule.organizationId = req.body.organizationId,
        stepRule.position = req.body.position,    
        stepRule.name = req.body.name,
        stepRule.description = req.body.description,
        stepRule.config = req.body.config,
        stepRule.createdById = req.body.createdById,
        stepRule.createdByName = req.body.createdByName,
        stepRule.updatedById = req.body.updatedById,
        stepRule.updatedByName = req.body.updatedByName
        return stepRule.save();
    })
    .then(stepRule => {
        res.status(201).json({
            message: 'Put Success',
            post: stepRule
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteStepRule = (req, res, next) => {
    const stepRuleId = req.params.stepRuleId;
    StepRules.findByPk(stepRuleId)
    .then(stepRule => { 
        return stepRule.destroy();
    })
    .then(stepRule => {
        res.status(201).json({
            message: 'Delete Success',
            post: stepRule
        });
    })
    .catch(err => {
        console.log(err)
    });
};

