const Objects = require('../models/objects');
const { Op, Sequelize } = require("sequelize");
const { QueryTypes } = require('sequelize');
const sequelize = require('../helpers/database');

exports.getObjects = (req, res, next) => {
    Objects.findAll()
    .then(objects => { 
        res.status(200).json(objects);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.cloneObject = (req, res, next) => {

    const createClone = (objectObj) => {
        Objects.create({
            objectParentId: objectObj.objectParentId,
            level: objectObj.level,
            itemId: objectObj.itemId,
            organizationId: objectObj.organizationId,
            name: objectObj.name,
            description: objectObj.description,
            label: objectObj.label,
            value: objectObj.value,
            type: objectObj.type,   
            comment: objectObj.comment,
            commentType: objectObj.commentType,
            choices: objectObj.choices,
            isMultiple: objectObj.isMultiple,
            defaultSelected: objectObj.defaultSelected,
            isSelected: objectObj.isSelected,
            isRequired: objectObj.isRequired,
            config: objectObj.config,
            createdById: objectObj.createdById,
            createdByName: objectObj.createdByName,
            updatedById: objectObj.updatedById,
            updatedByName: objectObj.updatedByName
        })
        .then(object => { 

            Objects.findAll({where: {objectParentId: objectObj.objectId}})
            .then(objects => {
                if (objects && objects.length > 0) {
                    for (let i = 0; objects.length > i; i++) {
                        const objectCopy = objects[i];
                        Object.assign(objectCopy, {objectParentId: object.objectId});
                        createClone(objectCopy);
                    }
                }

            })
            .catch(err => {
                console.log(err)
            });
        })
        .catch(err => { 
            console.log(err) 
        });
    }

    createClone(req.body);

};

exports.getObjectsByOrganizationType = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const type = req.body.type;
    const orderBy = [[ 'objectId', 'DESC' ]];

    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions.where,{organizationId: organizationId});
    if (type) {
        Object.assign(tableConditions.where, {config: {outputDataType: {value: {name: type}}}});
    }

    Objects.findAll(tableConditions)
    .then(objects => {
        setTimeout(() => {
            res.status(200).json(objects);
        }, 1000);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getObjectsFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    Objects.findAll({
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

exports.getObjectsChoices = (req, res, next) => {

    const objectId = req.body.objectId;
    const organizationId = req.body.organizationId;
    const orderBy = [[ 'objectId', 'DESC' ]];

    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions.where, {organizationId: organizationId}, {objectId: objectId});

    const objects = sequelize.query(`select  objects_sorted.*
    from    (select * from oblongsquare.objects
             order by objectParentId, objectId) objects_sorted,
            (select @pv := :objectId) initialisation
    where   find_in_set(objectParentId, @pv)
    and organizationId = :organizationId
    and length(@pv := concat(@pv, ',', objectId))`, {
        replacements: { objectId: objectId, organizationId: organizationId },
        type: QueryTypes.SELECT
    });

    objects.then(objects => { 

        let objectRaw = {};
        for (let i = 0; objects.length > i; i++) {
            if (!objectRaw['level' + objects[i].level.toString()]) {
                Object.assign(objectRaw, {['level' + objects[i].level.toString()] : []});
            }
        }

        const keys = Object.keys(objectRaw);

        for (let i = 0; keys.length > i; i++) {
            for (let j = 0; objects.length > j; j++) {
                if ((parseInt(keys[i].replace('level', ''))) === objects[j].level) {
                    const objectData = Object.assign(objects[j], {editMode: false});
                    objectRaw[keys[i]].push(objectData);
                }
            }
        }
  
        res.status(200).json(objectRaw);
    })
    .catch(err => {
        console.log(err)
    });
};


exports.getObjectsByOrganizationLevel = (req, res, next) => {
    const objectParentId = req.body.whereCondition.objectParentId? req.body.whereCondition.objectParentId : null;
    const organizationId = req.body.organizationId;
    const level = req.body.whereCondition.level? req.body.whereCondition.level : null;
    const orderBy = [[ 'objectId', 'DESC' ]];

    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});

    
    Objects.findAll(tableConditions)
    .then(objects => {
        setTimeout(() => {
            res.status(200).json(objects);
        }, 1000);
    })
    .catch(err => {
        console.log(err)
    });
};


exports.getObjectsOptions = (req, res, next) => {
    const objectParentId = req.body.whereCondition.objectParentId? req.body.whereCondition.objectParentId : null;
    const organizationId = req.body.organizationId;
    const level = req.body.whereCondition.level? req.body.whereCondition.level : null;
    const orderBy = [[ 'objectId', 'DESC' ]];

    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions, {limit: req.body.limit});
    Object.assign(tableConditions, {offset: req.body.offset});
    Object.assign(tableConditions.where, 
        {organizationId: organizationId},
        {objectParentId: objectParentId},
        {level: level});
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

    Objects.findAndCountAll(tableConditions)
    .then(objects => { 
        setTimeout(() => {
            res.status(200).json(objects);
        }, 1000);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getObjectsTable = (req, res, next) => {
    const objectParentId = req.body.whereCondition.objectParentId? req.body.whereCondition.objectParentId : null;
    const organizationId = req.body.organizationId;
    const level = req.body.whereCondition.level? req.body.whereCondition.level : null;
    const orderBy = [[ 'objectId', 'DESC' ]];

    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions, {limit: req.body.limit});
    Object.assign(tableConditions, {offset: req.body.offset});
    Object.assign(tableConditions.where, 
        {organizationId: organizationId},
        {objectParentId: objectParentId},
        {level: level});
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

    Objects.findAndCountAll(tableConditions)
    .then(objects => { 
        res.status(200).json(objects);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getObject = (req, res, next) => {
    const objectId = req.params.objectId;
    Objects.findByPk(objectId)
    .then(object => { 
        res.status(200).json(object);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createObject = (req, res, next) => {
    Objects.create({
        objectId: req.body.objectId,
        objectParentId: req.body.objectParentId,
        level: req.body.level,
        itemId: req.body.itemId,
        organizationId: req.body.organizationId,
        name: req.body.name,
        description: req.body.description,
        label: req.body.label,
        value: req.body.value,
        type: req.body.type,   
        comment: req.body.comment,
        commentType: req.body.commentType,
        choices: req.body.choices,
        isMultiple: req.body.isMultiple,
        defaultSelected: req.body.defaultSelected,
        isSelected: req.body.isSelected,
        isRequired: req.body.isRequired,
        config: req.body.config,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(object => { 
        res.status(201).json({
            message: 'Post Success',
            post: object
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateObject = (req, res, next) => {
    const objectId = req.params.objectId;
    Objects.findByPk(objectId)
    .then(object => { 
        object.objectId = req.body.objectId,
        object.objectParentId = req.body.objectParentId,
        object.level = req.body.level,
        object.itemId = req.body.itemId,
        object.organizationId = req.body.organizationId,
        object.name = req.body.name,
        object.description = req.body.description,
        object.label = req.body.label,
        object.value = req.body.value,
        object.type = req.body.type,
        object.comment = req.body.comment,
        object.commentType = req.body.commentType,
        object.choices = req.body.choices,
        object.isMultiple = req.body.isMultiple,
        object.defaultSelected = req.body.defaultSelected,
        object.isSelected = req.body.isSelected,
        object.isRequired = req.body.isRequired,
        object.config = req.body.config,
        object.createdById = req.body.createdById,
        object.createdByName = req.body.createdByName,
        object.updatedById = req.body.updatedById,
        object.updatedByName = req.body.updatedByName
        return object.save();
    })
    .then(object => {
        res.status(201).json({
            message: 'Put Success',
            post: object
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteObject = (req, res, next) => {
    const objectId = req.params.objectId;
    Objects.findByPk(objectId)
    .then(object => { 
        return object.destroy();
    })
    .then(object => {
        res.status(201).json({
            message: 'Delete Success',
            post: object
        });
    })
    .catch(err => {
        console.log(err)
    });
};