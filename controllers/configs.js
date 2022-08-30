
const Configs = require('../models/configs');

exports.getConfigs = (req, res, next) => {
    Configs.findAll()
    .then(configs => { 
        res.status(200).json(configs);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getConfigsByOrganizationSystemInterfaceName = (req, res, next) => {
    const organizationId = req.params.organizationId;
    const systemId = req.params.systemId;
    const interfaceId = req.params.interfaceId;
    const name = req.params.name
    Configs.findAll({
        where: { 
            organizationId: organizationId,
            systemId: systemId,
            interfaceId: interfaceId,
            name: name
        },
        // order: [ [ 'createdAt', 'DESC' ]],
    })
    .then(configs => { 
        res.status(200).json(configs);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getConfig = (req, res, next) => {
    const configId = req.params.configId;
    Configs.findByPk(configId)
    .then(config => { 
        res.status(200).json(config);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createConfig = (req, res, next) => {
    Configs.create({
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        name: req.body.name,
        jsonData: req.body.jsonData,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(config => { 
        res.status(201).json({
            message: 'Post Success',
            post: config
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateConfig = (req, res, next) => {
    console.log(req.body.jsonData[0])
    const configId = req.params.configId;
    Configs.findByPk(configId)
    .then(config => { 
        config.interfaceId = req.body.interfaceId,
        config.systemId = req.body.systemId,
        config.organizationId = req.body.organizationId,
        config.name = req.body.name,
        config.jsonData = req.body.jsonData,
        config.createdById = req.body.createdById,
        config.createdByName = req.body.createdByName,
        config.updatedById = req.body.updatedById,
        config.updatedByName = req.body.updatedByName
        return config.save();
    })
    .then(config => {
        res.status(201).json({
            message: 'Put Success',
            post: config
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteConfig = (req, res, next) => {
    const configId = req.params.configId;
    Configs.findByPk(configId)
    .then(config => { 
        return config.destroy();
    })
    .then(config => {
        res.status(201).json({
            message: 'Delete Success',
            post: config
        });
    })
    .catch(err => {
        console.log(err)
    });
};