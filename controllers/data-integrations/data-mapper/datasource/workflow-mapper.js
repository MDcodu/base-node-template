const WorkflowDatas = require('../../../workflow/workflow-data');
const { Op, Sequelize, QueryTypes } = require("sequelize");
const sequelize = require('../../../../helpers/database');

exports.getDataSourceWorkflowData = (req, res, next) => {

    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const stepId = req.body.stepId;

    const records = sequelize.query(`select * from
    (SELECT 
    workflowdataId,
    organizationId,
    systemId,
    interfaceId,
    stepId,
    objectId,
    recordId,
    name,
    value,
    label,
    rank() over (partition by concat(organizationId, systemId, interfaceId, stepId, objectId, recordId) order by workflowdataId desc) as rn
    FROM oblongsquare.workflowdata 
    where organizationId = :organizationId and systemId = :systemId and interfaceId = :interfaceId and stepId = :stepId) a 
    where rn = 1`, {
        replacements: { organizationId: organizationId, systemId: systemId, interfaceId: interfaceId, stepId: stepId },
        type: QueryTypes.SELECT
    });

    const records2 = sequelize.query(`SELECT DISTINCT
    recordId
    FROM oblongsquare.workflowdata 
    where organizationId = :organizationId and systemId = :systemId and interfaceId = :interfaceId and stepId = :stepId`, {
        replacements: { organizationId: organizationId, systemId: systemId, interfaceId: interfaceId, stepId: stepId },
        type: QueryTypes.SELECT
    });

    records2.then(recordsData => { 

        records.then(workflowData => { 

            const workflowDataCopy = JSON.parse(JSON.stringify(workflowData));

            let processedResults = [];
            let processedResult = {};
            
            for (let i = 0; recordsData.length > i; i++) {
                const filteredData = workflowDataCopy.filter(x => x.recordId === recordsData[i].recordId)

                const obj = (filteredData) => { 
                    for (let j = 0; filteredData.length > j; j++) {

                        Object.assign(processedResult, 
                            { [filteredData[j].objectId]: { 
                                objectId: filteredData[j].objectId,
                                name: filteredData[j].name, 
                                value: filteredData[j].value,
                                label: filteredData[j].label  
                            }});

                    }
                    return processedResult;
                }
                processedResults.push(obj(filteredData))
            }
            res.status(200).json(processedResults);
        })
        .catch(err => {
            console.log(err)
        });

    })
    .catch(err => {
        console.log(err)
    });


};