const axios = require('axios');

exports.getApiData = async(req, res, next) => {

    let url =  req.body.apiId;

    const response = await axios.get(url);
    res.status(200).send(JSON.parse(JSON.stringify(response.data)))

};

