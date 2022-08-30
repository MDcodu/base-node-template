
const DataIntegrations = require('../../models/data-integrations/data-integrations');
const WorkflowDatas = require('../../models/workflow/workflow-data');
const { Op, Sequelize } = require("sequelize");
const cron = require('node-cron');

const oracleEngine = require('../data-integrations/data-engine/oracle-engine')

exports.getDataIntegrations = (req, res, next) => {
    DataIntegrations.findAll()
    .then(dataIntegrations => { 
        res.status(200).json(dataIntegrations);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getDataIntegrationsFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    DataIntegrations.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col(`${fieldName}`)) ,'choices'],
        ]
    })
    .then(choices => { 
        console.log(choices)
        res.status(200).json(choices);
    })
    .catch(err => {
        console.log(err)
    });
}

exports.runSchedules = (req, res, next) => {

    cron.schedule("*/60 * * * * *", function() {

        DataIntegrations.findAll({where: {isActive: {name: 'yes'}}})
        .then(dataIntegrations => { 

            for (let i = 0; dataIntegrations.length > i; i++) {

                if (dataIntegrations[i].dataSource.dataSourceType.name === 'workflowEngine') {

                        WorkflowDatas.findAll({where: 
                            {organizationId: dataIntegrations[i].dataSource.organization.organizationId,
                            systemId: dataIntegrations[i].dataSource.system.systemId,
                            interfaceId: dataIntegrations[i].dataSource.interface.interfaceId,
                            stepId: dataIntegrations[i].dataSource.step.stepId}
                        })
                        .then(workflowDatas => { 
                                //console.log(workflowDatas)
                            } 
                        );

                } else if (dataIntegrations[i].dataSource.dataSourceType.name === 'api') {

                    console.log('x2')                 

                } else if (dataIntegrations[i].dataSource.dataSourceType.name === 'oracle') {

                    oracleEngine.oracleIntegrator(dataIntegrations[i])

                } else if (dataIntegrations[i].dataSource.dataSourceType.name === 'sqlServer') {

                    console.log('x4')   

                } else if (dataIntegrations[i].dataSource.dataSourceType.name === 'mySql') {

                    console.log('x5')

                }
                
            }

        })
        .catch(err => {
            console.log(err)
        });

    });
};

exports.getDataIntegrationTable = (req, res, next) => {
    const orderBy = [[ 'dataIntegrationId', 'DESC' ]];

    const organizationId = req.body.organizationId;
    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions, {limit: req.body.limit});
    Object.assign(tableConditions, {offset: req.body.offset});
    if (req.body.createdById !== '1') {
        Object.assign(tableConditions.where, {organizationId: organizationId});
    }
    for (let i = 0; objKeys.length > i; i++) {
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'recordPermission') {
            const keyName = objKeys[i].replace('Permission','');
            const textFilterObj = {[keyName] : {[Op.in]: whereCondition[objKeys[i]].arrayFilter}};
            Object.assign(tableConditions.where, {['permission']: textFilterObj})
        } 
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

    DataIntegrations.findAndCountAll(tableConditions)
    .then(dataIntegrations => {
        res.status(200).json(dataIntegrations);
    })
    .catch(err => {
        console.log(err)
    });
};


exports.getDataIntegration = (req, res, next) => {
    const dataIntegrationId = req.params.dataIntegrationId;
    DataIntegrations.findByPk(dataIntegrationId)
    .then(dataIntegration => { 
        res.status(200).json(dataIntegration);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createDataIntegration = (req, res, next) => {
    DataIntegrations.create({
        name: req.body.name,
        description: req.body.description,
        dataSource: req.body.dataSource,
        destination: req.body.destination,
        mapping: req.body.mapping,
        schedule: req.body.schedule,
        isActive: req.body.isActive,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(dataIntegration => { 
        res.status(201).json({
            message: 'Post Success',
            post: dataIntegration
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateDataIntegration = (req, res, next) => {
    const dataIntegrationId = req.params.dataIntegrationId;
    DataIntegrations.findByPk(dataIntegrationId)
    .then(dataIntegration => { 
        dataIntegration.name = req.body.name,
        dataIntegration.description = req.body.description,
        dataIntegration.dataSource = req.body.dataSource,
        dataIntegration.destination = req.body.destination,
        dataIntegration.mapping = req.body.mapping,
        dataIntegration.schedule = req.body.schedule,
        dataIntegration.isActive = req.body.isActive,
        dataIntegration.createdById = req.body.createdById,
        dataIntegration.createdByName = req.body.createdByName,
        dataIntegration.updatedById = req.body.updatedById,
        dataIntegration.updatedByName = req.body.updatedByName
        return dataIntegration.save();
    })
    .then(dataIntegration => {
        res.status(201).json({
            message: 'Put Success',
            post: dataIntegration
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteDataIntegration = (req, res, next) => {
    const dataIntegrationId = req.params.dataIntegrationsId;
    DataIntegrations.findByPk(dataIntegrationId)
    .then(dataIntegration => { 
        return dataIntegration.destroy();
    })
    .then(dataIntegration => {
        res.status(201).json({
            message: 'Delete Success',
            post: dataIntegration
        });
    })
    .catch(err => {
        console.log(err)
    });
};