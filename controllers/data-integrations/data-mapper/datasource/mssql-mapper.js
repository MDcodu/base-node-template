const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

exports.getMsSqlData = (req, res, next) => {

    const msSqlDb = new Sequelize(req.body.database, req.body.username, req.body.password, {
        dialect: 'mssql',
        host: 'localhost',
    });

    const records = msSqlDb.query(req.body.query, {
        type: QueryTypes.SELECT
    });

    records.then(response => { 

        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err)
    });

};