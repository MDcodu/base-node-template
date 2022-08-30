const express = require('express');
const router = express.Router();
const userSupervisorsController = require('../../../controllers/users/user-supervisors/user-supervisors');

router.get('/usersupervisors', userSupervisorsController.getUserSupervisors);

router.get('/usersupervisors/:userSupervisorId', userSupervisorsController.getUserSupervisor);

router.post('/usersupervisors', [], userSupervisorsController.createUserSupervisor);

router.post('/usersupervisors/table', [], userSupervisorsController.getUserSupervisorTable);

router.post('/usersupervisors/user', [], userSupervisorsController.getUserSupervisorUser);

router.put('/usersupervisors/:userSupervisorId', [], userSupervisorsController.updateUserSupervisor);

router.delete('/usersupervisors/:userSupervisorId', userSupervisorsController.deleteUserSupervisor);

module.exports = router;