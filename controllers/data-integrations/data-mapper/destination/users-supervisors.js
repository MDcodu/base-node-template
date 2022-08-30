const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

exports.getUsersSupervisorsData = (req, res, next) => {

    const mySqlDb = new Sequelize('oblongsquare', 'root', 'Solomon33', {
        dialect: 'mysql',
        host: 'localhost'
    });

    const records = mySqlDb.query(`select * from usersupervisors`, {
        type: QueryTypes.SELECT
    });

    records.then(response => { 

        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err)
    });

};