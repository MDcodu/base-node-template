const express = require('express');
const router = express.Router();
const dataIntegrationsController = require('../../controllers/data-integrations/data-integrations');

const oracleDataSourceMapperController = require('../../controllers/data-integrations/data-mapper/datasource/oracle-mapper');
const mysqlDataSourceMapperController = require('../../controllers/data-integrations/data-mapper/datasource/mysql-mapper');
const mssqlDataSourceMapperController = require('../../controllers/data-integrations/data-mapper/datasource/mssql-mapper');
const apiDataSourceMapperController = require('../../controllers/data-integrations/data-mapper/datasource/api-mapper');
const workflowDataSourceMapperController = require('../../controllers/data-integrations/data-mapper/datasource/workflow-mapper');

const workflowDestinationMapperController = require('../../controllers/data-integrations/data-mapper/destination/workflow-mapper');
const usersDestinationMapperController = require('../../controllers/data-integrations/data-mapper/destination/users');
const usersSupervisorsDestinationMapperController = require('../../controllers/data-integrations/data-mapper/destination/users-supervisors');
const usersManagersDestinationMapperController = require('../../controllers/data-integrations/data-mapper/destination/users-managers');

router.get('/dataintegrations', dataIntegrationsController.getDataIntegrations);

router.get('/dataintegrations/filterchoices/:fieldName', dataIntegrationsController.getDataIntegrationsFilterChoices);

router.get('/dataintegrations/runschedules', dataIntegrationsController.runSchedules);

router.get('/dataintegrations/:dataIntegrationId', dataIntegrationsController.getDataIntegration);

router.post('/dataintegrations/table', [], dataIntegrationsController.getDataIntegrationTable);

router.post('/dataintegrations', [], dataIntegrationsController.createDataIntegration);

router.put('/dataintegrations/:dataIntegrationId', [], dataIntegrationsController.updateDataIntegration);

router.delete('/dataintegrations/:dataIntegrationsId', dataIntegrationsController.deleteDataIntegration);



router.post('/dataintegrations/datasource/oracle-mapper', [], oracleDataSourceMapperController.getOracleData);

router.post('/dataintegrations/datasource/mysql-mapper', [], mysqlDataSourceMapperController.getMySqlData);

router.post('/dataintegrations/datasource/mssql-mapper', [], mssqlDataSourceMapperController.getMsSqlData);

router.post('/dataintegrations/datasource/api-mapper', [], apiDataSourceMapperController.getApiData);

router.post('/dataintegrations/datasource/workflow-mapper', [], workflowDataSourceMapperController.getDataSourceWorkflowData);


router.post('/dataintegrations/destination/workflow-mapper', [], workflowDestinationMapperController.getDestinationWorkflowData);

router.post('/dataintegrations/destination/users', [], usersDestinationMapperController.getUsersData);

router.post('/dataintegrations/destination/users-supervisors', [], usersSupervisorsDestinationMapperController.getUsersSupervisorsData);

router.post('/dataintegrations/destination/users-managers', [], usersManagersDestinationMapperController.getUsersManagersData);

module.exports = router;