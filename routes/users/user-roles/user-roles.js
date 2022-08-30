const express = require('express');
const router = express.Router();
const userRolesController = require('../../../controllers/users/user-roles/user-roles');

router.get('/userroles', userRolesController.getUserRoles);

router.get('/userroles/:userRoleId', userRolesController.getUserRole);

router.post('/userbyrole', [], userRolesController.getUserByRole);

router.post('/userroles', [], userRolesController.createUserRole);

router.post('/userroles/table', [], userRolesController.getUserRoleTable);

router.put('/userroles/:userRoleId', [], userRolesController.updateUserRole);

router.delete('/userroles/:userRoleId', userRolesController.deleteUserRole);

module.exports = router;