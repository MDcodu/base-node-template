const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

exports.getMySqlData = (req, res, next) => {

    const mySqlDb = new Sequelize(req.body.database, req.body.username, req.body.password, {
        dialect: 'mysql',
        host: 'localhost'
    });

    const records = mySqlDb.query(req.body.query, {
        type: QueryTypes.SELECT
    });

    records.then(response => { 

        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err)
    });

};