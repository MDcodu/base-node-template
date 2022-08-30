const express = require('express');
const router = express.Router();
const departmentsController = require('../../../controllers/organizations/departments/departments');

router.get('/departments', departmentsController.getDepartments);

router.get('/departments/choices/:fieldName', departmentsController.getDepartmentFilterChoices);

router.get('/departments/:departmentId', departmentsController.getDepartment);

router.post('/departments/table', [], departmentsController.getDepartmentsTable);

router.post('/departments', [], departmentsController.createDepartment);

router.put('/departments/:departmentId', [], departmentsController.updateDepartment);

router.delete('/departments/:departmentId', departmentsController.deleteDepartment);

module.exports = router;