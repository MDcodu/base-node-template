const express = require('express');
const router = express.Router();
const apisController = require('../../../controllers/organizations/apis/apis');

router.get('/apis', apisController.getApis);

router.get('/apis/choices/:fieldName', apisController.getApiFilterChoices);

router.get('/apis/:apiId', apisController.getApi);

router.post('/apis/objectchoice', [], apisController.getApisObjectChoice);

router.post('/apis/table', [], apisController.getApisTable);

router.post('/apis', [], apisController.createApi);

router.put('/apis/:apiId', [], apisController.updateApi);

router.delete('/apis/:apiId', apisController.deleteApi);

module.exports = router;