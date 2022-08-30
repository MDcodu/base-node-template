const Items = require('../models/items');

exports.getItems = (req, res, next) => {
    Items.findAll()
    .then(items => { 
        res.status(200).json(items);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getItemsByOrganizationSystem = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const orderBy = [[ 'itemId', 'DESC' ]];

    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions.where,
        {organizationId: organizationId},
        {systemId: systemId},
        {interfaceId: interfaceId});


    Items.findAll(tableConditions)
    .then(items => {
        setTimeout(() => {
            res.status(200).json(items);
        }, 1000);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getItemsByStepId = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const stepId = req.body.stepId;
    const orderBy = [[ 'position', 'ASC' ]];

    Items.findAll({ where: {
        organizationId: organizationId,
        systemId: systemId,
        interfaceId: interfaceId,
        stepId: stepId
    }})
    .then(items => {
        res.status(200).json(items);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getItemsTable = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const stepId = req.body.stepId;
    // const orderBy = [[ 'position', 'ASC' ]];

    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    // Object.assign(tableConditions, {order: orderBy});
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

    Items.findAndCountAll(tableConditions)
    .then(items => { 
        res.status(200).json(items);
    })
    .catch(err => {
        console.log(err)
    });
};


exports.getItem = (req, res, next) => {
    const itemId = req.params.itemId;
    Items.findByPk(itemId)
    .then(item => { 
        res.status(200).json(item);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createItem = (req, res, next) => {
    Items.create({
        stepId: req.body.stepId,
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        name: req.body.name,
        description: req.body.description,
        value: req.body.value,
        type: req.body.type,
        level: req.body.level,
        position: req.body.position,
        width: req.body.width,
        config: req.body.config,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(item => { 
        res.status(201).json({
            message: 'Post Success',
            post: item
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateItem = (req, res, next) => {
    const itemId = req.params.itemId;
    Items.findByPk(itemId)
    .then(item => { 
        item.stepId = req.body.stepId,
        item.interfaceId = req.body.interfaceId,
        item.systemId = req.body.systemId,
        item.organizationId = req.body.organizationId,
        item.name = req.body.name,
        item.description = req.body.description,
        item.value = req.body.value,
        item.type = req.body.type,
        item.level = req.body.level,
        item.position = req.body.position,
        item.width = req.body.width,
        item.config = req.body.config,
        item.createdById = req.body.createdById,
        item.createdByName = req.body.createdByName,
        item.updatedById = req.body.updatedById,
        item.updatedByName = req.body.updatedByName
        return item.save();
    })
    .then(item => {
        res.status(201).json({
            message: 'Put Success',
            post: item
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteItem = (req, res, next) => {
    const itemId = req.params.itemId;
    Items.findByPk(itemId)
    .then(item => { 
        return item.destroy();
    })
    .then(item => {
        res.status(201).json({
            message: 'Delete Success',
            post: item
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.moveItemLeft = (req, res, next) => {
    const currentItem = req.body.currentItem;
    const previousItem = req.body.previousItem;
    const tableFilter = req.body.tableFilter;
    Items.findByPk(currentItem.itemId)
    .then(currentItemData => { 
        currentItemData.stepId = currentItem.stepId,
        currentItemData.interfaceId = currentItem.interfaceId,
        currentItemData.systemId = currentItem.systemId,
        currentItemData.organizationId = currentItem.organizationId,
        currentItemData.name = currentItem.name,
        currentItemData.description = currentItem.description,
        currentItemData.value = currentItem.value,
        currentItemData.type = currentItem.type,
        currentItemData.level = currentItem.level,
        currentItemData.position = currentItem.position,
        currentItemData.width = currentItem.width,
        currentItemData.config = currentItem.config,
        currentItemData.createdById = currentItem.createdById,
        currentItemData.createdByName = currentItem.createdByName,
        currentItemData.updatedById = currentItem.updatedById,
        currentItemData.updatedByName = currentItem.updatedByName
        return currentItemData.save();
    })
    .then(item => {

        const organizationId = tableFilter.organizationId;
        const systemId = tableFilter.systemId;
        const interfaceId = tableFilter.interfaceId;
        const stepId = tableFilter.stepId;
        // const orderBy = [[ 'position', 'ASC' ]];
    
        let tableConditions = {};
        Object.assign(tableConditions, {where: {}});
        // Object.assign(tableConditions, {order: orderBy});
        Object.assign(tableConditions, {limit: tableFilter.limit});
        Object.assign(tableConditions, {offset: tableFilter.offset});
        Object.assign(tableConditions.where, 
            {organizationId: organizationId}, 
            {systemId: systemId}, 
            {interfaceId: interfaceId},
            {stepId: stepId});

        Items.findByPk(previousItem.itemId)
        .then(previousItemData => { 
            previousItemData.stepId = previousItem.stepId,
            previousItemData.interfaceId = previousItem.interfaceId,
            previousItemData.systemId = previousItem.systemId,
            previousItemData.organizationId = previousItem.organizationId,
            previousItemData.name = previousItem.name,
            previousItemData.description = previousItem.description,
            previousItemData.value = previousItem.value,
            previousItemData.type = previousItem.type,
            previousItemData.level = previousItem.level,
            previousItemData.position = previousItem.position,
            previousItemData.width = previousItem.width,
            previousItemData.config = previousItem.config,
            previousItemData.createdById = previousItem.createdById,
            previousItemData.createdByName = previousItem.createdByName,
            previousItemData.updatedById = previousItem.updatedById,
            previousItemData.updatedByName = previousItem.updatedByName
            return previousItemData.save();
        })
        .then(item => {

            Items.findAndCountAll(tableConditions)
            .then(items => { 
                res.status(200).json(items);
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

exports.moveItemRight = (req, res, next) => {
    const currentItem = req.body.currentItem;
    const previousItem = req.body.previousItem;
    const tableFilter = req.body.tableFilter;
    Items.findByPk(currentItem.itemId)
    .then(currentItemData => { 
        currentItemData.stepId = currentItem.stepId,
        currentItemData.interfaceId = currentItem.interfaceId,
        currentItemData.systemId = currentItem.systemId,
        currentItemData.organizationId = currentItem.organizationId,
        currentItemData.name = currentItem.name,
        currentItemData.description = currentItem.description,
        currentItemData.value = currentItem.value,
        currentItemData.type = currentItem.type,
        currentItemData.level = currentItem.level,
        currentItemData.position = currentItem.position,
        currentItemData.width = currentItem.width,
        currentItemData.config = currentItem.config,
        currentItemData.createdById = currentItem.createdById,
        currentItemData.createdByName = currentItem.createdByName,
        currentItemData.updatedById = currentItem.updatedById,
        currentItemData.updatedByName = currentItem.updatedByName
        return currentItemData.save();
    })
    .then(step => {

        const organizationId = tableFilter.organizationId;
        const systemId = tableFilter.systemId;
        const interfaceId = tableFilter.interfaceId;
        const stepId = tableFilter.stepId;
        // const orderBy = [[ 'position', 'ASC' ]];
    
        let tableConditions = {};
        Object.assign(tableConditions, {where: {}});
        // Object.assign(tableConditions, {order: orderBy});
        Object.assign(tableConditions, {limit: tableFilter.limit});
        Object.assign(tableConditions, {offset: tableFilter.offset});
        Object.assign(tableConditions.where, 
            {organizationId: organizationId}, 
            {systemId: systemId}, 
            {interfaceId: interfaceId},
            {stepId: stepId});

        Items.findByPk(previousItem.itemId)
        .then(previousItemData => { 
            previousItemData.stepId = previousItem.stepId,
            previousItemData.interfaceId = previousItem.interfaceId,
            previousItemData.systemId = previousItem.systemId,
            previousItemData.organizationId = previousItem.organizationId,
            previousItemData.name = previousItem.name,
            previousItemData.description = previousItem.description,
            previousItemData.value = previousItem.value,
            previousItemData.type = previousItem.type,
            previousItemData.level = previousItem.level,
            previousItemData.position = previousItem.position,
            previousItemData.width = previousItem.width,
            previousItemData.config = previousItem.config,
            previousItemData.createdById = previousItem.createdById,
            previousItemData.createdByName = previousItem.createdByName,
            previousItemData.updatedById = previousItem.updatedById,
            previousItemData.updatedByName = previousItem.updatedByName
            return previousItemData.save();
        })
        .then(item => {

            Items.findAndCountAll(tableConditions)
            .then(items => { 
                res.status(200).json(items);
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