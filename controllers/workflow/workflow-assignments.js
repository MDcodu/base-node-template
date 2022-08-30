
const WorkflowAssignments = require('../../models/workflow/workflow-assignments');
const Steps = require('../../models/steps/steps');
const mailer = require('../../helpers/mailer');
const { QueryTypes } = require('sequelize');
const sequelize = require('../../helpers/database');

exports.getWorkflowAssignments = (req, res, next) => {
    WorkflowAssignments.findAll()
    .then(workflowAssignments => { 
        res.status(200).json(workflowAssignments);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowAssignmentUser = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const userId = req.body.userId;

    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions.where, 
        {organizationId: organizationId}, 
        {userId: userId});

    WorkflowAssignments.findAll(tableConditions)
    .then(WorkflowAssignmentUser  => { 
        res.status(200).json(WorkflowAssignmentUser );
    })
    .catch(err => {
        console.log(err)
    });
};


exports.getWorkflowAssignmentStep = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const stepId = req.body.stepId;
    const recordId = req.body.recordId;
    const userId = req.body.userId;

    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions.where, 
        {organizationId: organizationId}, 
        {systemId: systemId}, 
        {interfaceId: interfaceId},
        {stepId: stepId},
        {recordId: recordId},
        {userId: userId});

    WorkflowAssignments.findAll(tableConditions)
    .then(WorkflowAssignmentStep => { 
        res.status(200).json(WorkflowAssignmentStep);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowAssignment = (req, res, next) => {

    const dataId = req.params.dataId;
    WorkflowAssignments.findByPk(dataId)
    .then(workflowAssignment => { 
        res.status(200).json(workflowAssignment);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowAssignmentDelegation = (req, res, next) => {

    WorkflowAssignments.findAll({where: {
        transaction: 'delegation',
        updatedById: req.body.updatedById,
    }})
    .then(workflowAssignment => { 
        const response = workflowAssignment.filter(x => !x.isCompleted)
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowAssignmentDelegated = (req, res, next) => {

    WorkflowAssignments.findAll({where: {
        organizationId: req.body.organizationId,
        systemId: req.body.systemId,
        interfaceId: req.body.interfaceId,
        stepId: req.body.stepId,
        recordId: req.body.recordId,
        transaction: req.body.transaction
    }})
    .then(workflowAssignment => { 
        const response = workflowAssignment.filter(x => !x.isCompleted)
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createWorkflowAssignment = async(req, res, next) => {

    if (req.body.transaction !== 'delegation') {
        const update = await this.updateWorkflowAssignmentGroup({
            organizationId: req.body.organizationId,
            systemId: req.body.systemId,
            interfaceId: req.body.interfaceId,
            recordId: req.body.recordId
        });
    }

    const done = await this.sendMail(req.body);

    WorkflowAssignments.create({
        recordId: req.body.recordId,
        stepId: req.body.stepId,
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        userId: req.body.userId,
        username: req.body.username,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        transaction: req.body.transaction,
        isCompleted: req.body.isCompleted,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(workflowAssignment => { 
        res.status(201).json({
            message: 'Post Success',
            post: workflowAssignment
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.createWorkflowAssignmentGroup = async(req, res, next) => {

    const userList =  req.body.userList;
    const recordId =  req.body.recordId;
    const userSession = req.body.userSession;
    const step = req.body.step;
    const mailSubject = req.body.mailSubject;

    const update = await this.updateWorkflowAssignmentGroup({
        organizationId: step.organizationId,
        systemId: step.systemId,
        interfaceId: step.interfaceId,
        recordId: recordId
    });


    const assignmentInfo = await WorkflowAssignments.findAll({
        where: {
            recordId: recordId,
            stepId: step.stepId,
            interfaceId: step.interfaceId,
            systemId: step.systemId,
            organizationId: step.organizationId,
        }
    })
    .then(workflowAssignment => { 
        return workflowAssignment;
    })
    .catch(err => { 
        console.log(err) 
    });

    for (let i = 0; userList.length > i; i++) {

        record = {
            recordId: recordId,
            stepId: step.stepId + 1,
            interfaceId: step.interfaceId,
            systemId: step.systemId,
            organizationId: step.organizationId,
            userId: userList[i].userId,
            username: userList[i].username,
            firstName: userList[i].firstName,
            middleName: userList[i].middleName,
            lastName: userList[i].lastName,
            email: userList[i].email,
            subject: `✔ Task: PSCC Employee Evaluation System - Step: ${step.index + 1} - ${mailSubject}`,
            message: `✔ Task: PSCC Employee Evaluation System - Step: ${step.index + 1} - ${mailSubject}`,
            transaction: 'create',
            isCompleted: false,
            createdById: userSession.createdById,
            createdByName: userSession.createdByName,
            updatedById: userSession.updatedById,
            updatedByName: userSession.updatedByName
        };


        const created = await WorkflowAssignments.create(record)
        .then(workflowAssignment => { 
            return workflowAssignment;
        })
        .catch(err => { 
            console.log(err) 
        });

        const done = this.sendMail(created);

    }

    res.status(201).json({
        message: 'Update Done',
        post: 'Done'
    });

};

exports.sendMail = async(workflowAssignment) => {

    const steps = await Steps.findAll({
        where: {
            organizationId: workflowAssignment.organizationId,
            systemId: workflowAssignment.systemId,
            interfaceId: workflowAssignment.interfaceId,
        }
    })
    .then(steps => { 
        return steps;
    })
    .catch(err => { 
        console.log(err) 
    });

    const index = steps.findIndex(step => step.stepId === workflowAssignment.stepId -1);

    let subject = workflowAssignment.subject;
    let message1 = `Dear User, A Task has been assigned to you. Please click the reference link thanks.`;
    let message2 = `عزيزي المستخدم. الرجاء الضغط على الرابط  شكرا.`;

    if (steps.length === (index + 1)) {
        subject = 'Evaluation Completed';
        message1 = `Dear Your Evaluation is completed. For more information please click the link`;
        message2 = `عزيزي المستخدم ، تم الإنتهاء من تقيمك .للمزيد من المعلومات  الرجاء الضغط على الرابط`;
    }

    const transporter = await mailer.sendWorkflowMail();

    // try {
    //     transporter.sendMail({
    //         from: 'RecontractingNotification@pscc.med.sa', // sender address
    //         bcc: "clacuesta@pscc.med.sa", // list of receivers
    //         to: `${workflowAssignment.email}`, // list of receivers
    //         subject: `${subject}`, // Subject line
    //         text: "Employee Assessment", // plain text body
    //         html: `<table style="width:100%">
    //         <tr>
    //         <td style="width:40%"><h3>Electronic Employee Assessment</h3></td>
    //         <td style="width:20%"></td>
    //         <td style="width:40%"><b>تقييم الموظف الإلكتروني</b></td>
    //         </tr>
    //         <tr>
    //         <td style="width:40%">Dear User, A Task has been assigned to you. Please click the reference link thanks.</td>
    //         <td style="width:20%"></td>
    //         <td style="width:40%">عزيزي المستخدم ، تم تعيين مهمة لك. الرجاء الضغط على الرابط المرجعي شكرا.</td>
    //         </tr>
    //         <tr>
    //         <td colspan="3" align="center">${subject}</a>
    //         </td>
    //         </tr>
    //         <tr>
    //         <td colspan="3" align="center"> <a style="text-align:center;" 
    //         href="http://reportsrv01.pscc.local/Angular/#/auth/-->/2/-->/-->/-->/1/-->/1/-->"> Employee Assessment Task. </a>
    //         </td>
    //         </tr>
    //         <tr>
    //         <td colspan="3" align="center">
    //         </td>
    //         </tr>
    //         <tr>
    //         <td colspan="3" align="center">انقر فوق الارتباط أعلاه للوصول إلى التقييم.</a>
    //         </td>
    //         </tr>
    //         </table>
    //         `, // html body
    //     });
    // } catch (err) {
    //     console.log(err.message)
    // }

    return true;
}

exports.updateWorkflowAssignmentGroup = async(params) => {
    const organizationId = params.organizationId;
    const systemId = params.systemId;
    const interfaceId = params.interfaceId;
    const recordId = typeof(params.recordId) === 'string'? parseInt(params.recordId) : params.recordId;

    const records = await sequelize.query(`
    update oblongsquare.workflowassignments
    set isCompleted = "true"
    where organizationId = :organizationId and systemId = :systemId and interfaceId = :interfaceId and recordId = :recordId`, {
        replacements: { organizationId: organizationId, systemId: systemId,  interfaceId: interfaceId, recordId: recordId},
        type: QueryTypes.UPDATE
    });


    return records;
}

exports.completeSteps = async(req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const recordId = typeof(req.body.recordId) === 'string'? parseInt(req.body.recordId) : req.body.recordId;

    const records = await sequelize.query(`
    update oblongsquare.workflowassignments
    set isCompleted = "true"
    where organizationId = :organizationId and systemId = :systemId and interfaceId = :interfaceId and recordId = :recordId`, {
        replacements: { organizationId: organizationId, systemId: systemId,  interfaceId: interfaceId, recordId: recordId},
        type: QueryTypes.UPDATE
    });


    res.status(201).json({
        message: 'Put Success',
        post: records
    });
}

exports.updateWorkflowAssignment = (req, res, next) => {
    const workflowAssignmentId = req.params.workflowAssignmentId;
    recordId = parseInt(req.body.recordId);
    WorkflowAssignments.findByPk(req.body.workflowAssignmentId)
    .then(workflowAssignment => { 
        workflowAssignment.recordId = recordId,
        workflowAssignment.stepId = req.body.stepId,
        workflowAssignment.interfaceId = req.body.interfaceId,
        workflowAssignment.systemId = req.body.systemId,
        workflowAssignment.organizationId = req.body.organizationId,
        workflowAssignment.userId = req.body.userId,
        workflowAssignment.username = req.body.username,
        workflowAssignment.firstName = req.body.firstName,
        workflowAssignment.middleName = req.body.middleName,
        workflowAssignment.lastName = req.body.lastName,
        workflowAssignment.email = req.body.email,
        workflowAssignment.subject = req.body.subject,
        workflowAssignment.message = req.body.message,
        workflowAssignment.transaction = req.body.transaction,
        workflowAssignment.isCompleted = req.body.isCompleted,
        workflowAssignment.createdById = req.body.createdById,
        workflowAssignment.createdByName = req.body.createdByName,
        workflowAssignment.updatedById = req.body.updatedById,
        workflowAssignment.updatedByName = req.body.updatedByName
        return workflowAssignment.save();
    })
    .then(workflowAssignment => {

        res.status(201).json({
            message: 'Put Success',
            post: workflowAssignment
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteWorkflowAssignment = (req, res, next) => {
    const workflowAssignmentId = req.params.workflowAssignmentId;
    WorkflowAssignments.findByPk(workflowAssignmentId)
    .then(workflowAssignment => { 
        return workflowAssignment.destroy();
    })
    .then(workflowAssignment => {
        res.status(201).json({
            message: 'Delete Success',
            post: workflowAssignment
        });
    })
    .catch(err => {
        console.log(err)
    });
};