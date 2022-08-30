const express = require('express');
const router = express.Router();
const userManagersController = require('../../../controllers/users/user-managers/user-managers');

router.get('/usermanagers', userManagersController.getUserManagers);

router.get('/usermanagers/:userManagerId', userManagersController.getUserManager);

router.post('/usermanagers', [], userManagersController.createUserManager);

router.post('/usermanagers/table', [], userManagersController.getUserManagerTable);

router.post('/usermanagers/user', [], userManagersController.getUserManagerUser);

router.put('/usermanagers/:userManagerId', [], userManagersController.updateUserManager);

router.delete('/usermanagers/:userManagerId', userManagersController.deleteUserManager);

module.exports = router;