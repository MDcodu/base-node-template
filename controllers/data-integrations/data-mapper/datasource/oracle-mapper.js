const oracleConnection = require('oracledb');

exports.getOracleData = async(req, res, next) => {

    const oracledb = oracleConnection.getConnection({
        user: req.body.username,
        password: req.body.password,
        connectionString: req.body.host
    });

    try {
        connection = await oracledb;
 
        console.log('connected to oracle');
 
        let query = req.body.query;
        
        result = await connection.execute(query,
        [],
        { outFormat: oracledb.OBJECT });        
 
    } catch (err) {
        await connection.close();
        console.log(result)
        console.log('close connection success');
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('close connection success');
                if (result.rows.length == 0) {
                    return res.send('query send no rows');
                } else {
                    let processedResults = [];
                    let processedResult = {};

                    for (let i = 0; result.metaData.length > i; i++) {
                        Object.assign(processedResult, {[result.metaData[i].name]: null});
                    }

                    const keys = Object.keys(processedResult);

                    for (let i = 0; result.rows.length > i; i++) {
                        const subArray = result.rows[i];
                        const obj = (subArray) => {
                            
                            for (let j = 0; j < subArray.length; j++) {
                                Object.assign(processedResult, {[keys[j]]: subArray[j]});
                            }
                            return processedResult;
                        }
                        processedResults.push(obj(subArray))
                    }

                    return res.status(200).json(processedResults);
                }
            } catch (err) {
                return res.status(200).json(err);
            }
        }
    }

};
