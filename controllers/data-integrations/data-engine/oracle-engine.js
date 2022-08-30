const oracleConnection = require('oracledb');
const { QueryTypes } = require("sequelize");
const sequelize = require('../../../helpers/database');

const WorkflowRecords = require('../../../models/workflow/workflow-records');
const WorkflowDatas = require('../../../models/workflow/workflow-data');
const WorkflowHistories = require('../../../models/workflow/workflow-histories');

exports.oracleIntegrator = async(mappedData) => {

    const connectionString = {
        user: mappedData.dataSource.username,
        password: mappedData.dataSource.password,
        host: mappedData.dataSource.host,
        query: mappedData.dataSource.query
    }
    
    const destination = mappedData.destination;
    const mapping = mappedData.mapping;
    const dataSource = await getOracleData(connectionString);

    if (destination.destinationType.name === 'workflowEngine' && destination.interface) {
        for (let i = 0; dataSource.length > i; i++) {

            const identity = mapping.filter(x => x.identityField !== null)
    
            const params = {
                organizationId: destination.organization.organizationId,
                systemId: destination.system.systemId,
                interfaceId: destination.interface.interfaceId,
                stepId: destination.step.stepId,
                name: identity[0].destination.name,
                value: `"${dataSource[i][identity[0].dataSourceIdentity]}"`, 
            }

            const exists = await checkExisting(params);
            
            if (exists) {
    
            } else {
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
            const fileData = await createFileData(dataSource[i], mapping);

            const workflowRecord = {body: {
                interfaceId: params.interfaceId,
                systemId: params.systemId,
                organizationId: params.organizationId,
                activeStep: 'Step: 2',
                stepStatus: '2 out of 8 Steps',
                fileStatus: 'In Progress',
                isEmployee: null,
                isSupervisor: null,
                isManager: null,
                isSubmitted: null,
                jsonData: {},
                fileData: fileData,
                objectData: {},
                deleteFlag: null,
                createdById: 0,
                createdByName: 'system generated',
                updatedById: '0',
                updatedByName: 'system generated'
            } } 

                const done = await createWorkflowRecord(workflowRecord);
                console.log(done)
            }
      
        }
    }


}

const createFileData = async(record, mapping) => {

    let fileData = [];
 
    for (let j = 0; mapping.length > j; j++) {
        if (mapping[j].dataSourceIdentity && mapping[j].destination) {

            const objectObj = await mapping[j].destination.workflowRecord

            Object.assign(objectObj, 
                {value: record[mapping[j].dataSourceIdentity]}, 
                {workflowDataId: null},
                {createdById: '0'},
                {createdByName: 'system generated'});

            fileData.push(objectObj);
        }
    }

    return fileData;
}
 
const checkExisting = (params) => {

    const records = sequelize.query(`SELECT * 
    FROM oblongsquare.workflowdata where 
    organizationId = :organizationId and
    systemId = :systemId and
    interfaceId = :interfaceId and
    stepId = :stepId and
    name = :name and
    CONVERT(value, CHAR) = :value`, {
        replacements: { 
            organizationId: params.organizationId,
            systemId: params.systemId,
            interfaceId: params.interfaceId,
            stepId: params.stepId,
            name: params.name,
            value: params.value 
        },
        type: QueryTypes.SELECT
    });

    return records.then(records => { 
        console.log(records.length);
        if (records.length > 0) {
            return true;
        } else {
            return false;
        }
    })
    .catch(err => {
        console.log(err)
    });
}

const getOracleData = async(connectionString) => {

    const oracledb = await oracleConnection.getConnection({
        user: connectionString.user,
        password: connectionString.password,
        connectionString: connectionString.host
    });        

    try {
        connection = await oracledb;
 
        console.log('connected to oracle');
 
        let query = connectionString.query;
        
        result = await connection.execute(query,
        [],
        { outFormat: oracleConnection.OBJECT });        
 
    } catch (err) {
        await connection.close();
        console.log('close connection success');
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('close connection success');
                if (result.rows.length == 0) {
                    return res.send('query send no rows');
                } else {

                    return result.rows;

                }
            } catch (err) {
                return result.rows;
            }
        }
    }

}

const createWorkflowRecord = (req) => {
     return WorkflowRecords.create({
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        activeStep: req.body.activeStep,
        stepStatus: req.body.stepStatus,
        fileStatus: req.body.fileStatus,
        isEmployee: req.body.isEmployee,
        isSupervisor: req.body.isSupervisor,
        isManager: req.body.isManager,
        isSubmitted: req.body.isSubmitted,
        jsonData: req.body.jsonData,
        fileData: req.body.fileData,
        objectData: req.body.objectData,
        deleteFlag: req.body.deleteFlag,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(workflowRecord => { 
        let historyDumpFile = [];
        for (let i = 0; workflowRecord.fileData.length > i; i++) { 
            Object.assign(workflowRecord.fileData[i], {recordId: workflowRecord.recordId});
        }
        return WorkflowDatas.bulkCreate(workflowRecord.fileData).then(() => {
            return WorkflowHistories.bulkCreate(historyDumpFile).then(() => {
                return true;
            }).catch(err => {
                console.log(err)
            });
        }).catch(err => { 
            console.log(err) 
        });
    })
    .catch(err => { 
        console.log(err) 
    });
}