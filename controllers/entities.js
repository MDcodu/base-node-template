
const Entities = require('../models/entities');

exports.getEntities = (req, res, next) => {
    Entities.findAll()
    .then(entities => { 
        res.status(200).json(entities);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getEntity = (req, res, next) => {
    const entityId = req.params.entityId;
    Entities.findByPk(entityId)
    .then(entity => { 
        res.status(200).json(entity);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createEntity = (req, res, next) => {
    Entities.create({
        dataName: req.body.dataName,
        jsonData: req.body.jsonData,
        modifiedBy: req.body.modifiedBy,
        inputBy: req.body.inputBy
    })
    .then(entity => { 
        res.status(201).json({
            message: 'Post Success',
            post: entity
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateEntity = (req, res, next) => {
    const entityId = req.params.entityId;
    Entities.findByPk(entityId)
    .then(entity => { 
        entity.dataName = req.body.dataName,
        entity.jsonData = req.body.jsonData,
        entity.modifiedBy = req.body.modifiedBy
        return entity.save();
    })
    .then(entity => {
        res.status(201).json({
            message: 'Put Success',
            post: entity
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteEntity = (req, res, next) => {
    const entityId = req.params.entityId;
    Entities.findByPk(entityId)
    .then(entity => { 
        return entity.destroy();
    })
    .then(entity => {
        res.status(201).json({
            message: 'Delete Success',
            post: entity
        });
    })
    .catch(err => {
        console.log(err)
    });
};