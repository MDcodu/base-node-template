const Steps = require('../../models/steps/steps');
const { Op, Sequelize } = require("sequelize");

exports.getSteps = (req, res, next) => {
    Steps.findAll()
    .then(steps => { 
        res.status(200).json(steps);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getStepsByOrganizationSystem = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const orderBy = [[ 'stepId', 'ASC' ]];

    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions.where,
        {organizationId: organizationId},
        {systemId: systemId},
        {interfaceId: interfaceId});


    Steps.findAll(tableConditions)
    .then(steps => {
        res.status(200).json(steps);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getStepFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    Steps.findAll({
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

exports.getStepsTable = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const orderBy = [[ 'position', 'ASC' ]];

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
        {interfaceId: interfaceId});
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

    Steps.findAndCountAll(tableConditions)
    .then(steps => { 
        res.status(200).json(steps);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getStep = (req, res, next) => {
    const stepId = req.params.stepId;
    Steps.findByPk(stepId)
    .then(step => { 
        res.status(200).json(step);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getStepByOrganization = (req, res, next) => {
    const organizationId = req.params.organizationId;
    Steps.findAll({
        where: { organizationId: organizationId},
        order: [ [ 'createdAt', 'DESC' ]],
    })
    .then(step => { 
        res.status(200).json(step);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createStep = async(req, res, next) => {
    let stepData;
    await Steps.create({
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        position: req.body.position,
        name: req.body.name,
        description: req.body.description,
        selected: req.body.selected,
        config: req.body.config,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(step => { 
        stepData = step;
        res.status(201).json({
            message: 'Post Success',
            post: step
        });
    })
    .catch(err => { 
        console.log(err);
        res.status(400).send({
            message: 'This is an error!'
         });
    });

    Steps.findByPk(stepData.stepId)
    .then(step => { 
        step.interfaceId = req.body.interfaceId,
        step.systemId = req.body.systemId,
        step.organizationId = req.body.organizationId,
        step.position = stepData.stepId,    
        step.name = req.body.name,
        step.description = req.body.description,
        step.selected = req.body.selected,
        step.config = req.body.config,
        step.createdById = req.body.createdById,
        step.createdByName = req.body.createdByName,
        step.updatedById = req.body.updatedById,
        step.updatedByName = req.body.updatedByName
        return step.save();
    });
};

exports.updateStep = (req, res, next) => {
    const stepId = req.params.stepId;
    Steps.findByPk(stepId)
    .then(step => { 
        step.interfaceId = req.body.interfaceId,
        step.systemId = req.body.systemId,
        step.organizationId = req.body.organizationId,
        step.position = req.body.position,    
        step.name = req.body.name,
        step.description = req.body.description,
        step.selected = req.body.selected,
        step.config = req.body.config,
        step.createdById = req.body.createdById,
        step.createdByName = req.body.createdByName,
        step.updatedById = req.body.updatedById,
        step.updatedByName = req.body.updatedByName
        return step.save();
    })
    .then(step => {
        res.status(201).json({
            message: 'Put Success',
            post: step
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteStep = (req, res, next) => {
    const stepId = req.params.stepId;
    Steps.findByPk(stepId)
    .then(step => { 
        return step.destroy();
    })
    .then(step => {
        res.status(201).json({
            message: 'Delete Success',
            post: step
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.moveStepUp = (req, res, next) => {
    const currentStep = req.body.currentStep;
    const previousStep = req.body.previousStep;
    const tableFilter = req.body.tableFilter;
    Steps.findByPk(currentStep.stepId)
    .then(currentStepData => { 
        currentStepData.interfaceId = currentStep.interfaceId,
        currentStepData.systemId = currentStep.systemId,
        currentStepData.organizationId = currentStep.organizationId,
        currentStepData.position = currentStep.position,    
        currentStepData.name = currentStep.name,
        currentStepData.description = currentStep.description,
        currentStepData.config = currentStep.config,
        currentStepData.createdById = currentStep.createdById,
        currentStepData.createdByName = currentStep.createdByName,
        currentStepData.updatedById = currentStep.updatedById,
        currentStepData.updatedByName = currentStep.updatedByName
        return currentStepData.save();
    })
    .then(step => {

        const organizationId = tableFilter.organizationId;
        const systemId = tableFilter.systemId;
        const interfaceId = tableFilter.interfaceId;
        const orderBy = [[ 'position', 'ASC' ]];
    
        let tableConditions = {};
        Object.assign(tableConditions, {where: {}});
        Object.assign(tableConditions, {order: orderBy});
        Object.assign(tableConditions, {limit: tableFilter.limit});
        Object.assign(tableConditions, {offset: tableFilter.offset});
        Object.assign(tableConditions.where, 
            {organizationId: organizationId}, 
            {systemId: systemId}, 
            {interfaceId: interfaceId});

        Steps.findByPk(previousStep.stepId)
        .then(previousStepData => { 
            previousStepData.interfaceId = previousStep.interfaceId,
            previousStepData.systemId = previousStep.systemId,
            previousStepData.organizationId = previousStep.organizationId,
            previousStepData.position = previousStep.position,    
            previousStepData.name = previousStep.name,
            previousStepData.description = previousStep.description,
            previousStepData.config = previousStep.config,
            previousStepData.createdById = previousStep.createdById,
            previousStepData.createdByName = previousStep.createdByName,
            previousStepData.updatedById = previousStep.updatedById,
            previousStepData.updatedByName = previousStep.updatedByName
            return previousStepData.save();
        })
        .then(step => {

            Steps.findAndCountAll(tableConditions)
            .then(steps => { 
                res.status(200).json(steps);
            })
            .catch(err => {
                console.log(err)
            });
        })
        .catch(err => {
            console.log(err)
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.moveStepDown = (req, res, next) => {
    const currentStep = req.body.currentStep;
    const previousStep = req.body.previousStep;
    const tableFilter = req.body.tableFilter;
    Steps.findByPk(currentStep.stepId)
    .then(currentStepData => { 
        currentStepData.interfaceId = currentStep.interfaceId,
        currentStepData.systemId = currentStep.systemId,
        currentStepData.organizationId = currentStep.organizationId,
        currentStepData.position = currentStep.position,    
        currentStepData.name = currentStep.name,
        currentStepData.description = currentStep.description,
        currentStepData.config = currentStep.config,
        currentStepData.createdById = currentStep.createdById,
        currentStepData.createdByName = currentStep.createdByName,
        currentStepData.updatedById = currentStep.updatedById,
        currentStepData.updatedByName = currentStep.updatedByName
        return currentStepData.save();
    })
    .then(step => {

        const organizationId = tableFilter.organizationId;
        const systemId = tableFilter.systemId;
        const interfaceId = tableFilter.interfaceId;
        const orderBy = [[ 'position', 'ASC' ]];
    
        let tableConditions = {};
        Object.assign(tableConditions, {where: {}});
        Object.assign(tableConditions, {order: orderBy});
        Object.assign(tableConditions, {limit: tableFilter.limit});
        Object.assign(tableConditions, {offset: tableFilter.offset});
        Object.assign(tableConditions.where, 
            {organizationId: organizationId}, 
            {systemId: systemId}, 
            {interfaceId: interfaceId});

        Steps.findByPk(previousStep.stepId)
        .then(previousStepData => { 
            previousStepData.interfaceId = previousStep.interfaceId,
            previousStepData.systemId = previousStep.systemId,
            previousStepData.organizationId = previousStep.organizationId,
            previousStepData.position = previousStep.position,    
            previousStepData.name = previousStep.name,
            previousStepData.description = previousStep.description,
            previousStepData.config = previousStep.config,
            previousStepData.createdById = previousStep.createdById,
            previousStepData.createdByName = previousStep.createdByName,
            previousStepData.updatedById = previousStep.updatedById,
            previousStepData.updatedByName = previousStep.updatedByName
            return previousStepData.save();
        })
        .then(step => {

            Steps.findAndCountAll(tableConditions)
            .then(steps => { 
                res.status(200).json(steps);
            })
            .catch(err => {
                console.log(err)
            });
        })
        .catch(err => {
            console.log(err)
        });
    })
    .catch(err => {
        console.log(err)
    });
};