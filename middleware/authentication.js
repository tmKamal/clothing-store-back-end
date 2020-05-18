const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
	/* 
    We are passing the token using headers 
    Autherization is the key and it contains the value(token)- normal key value pairs.
    autheriztion key store its values as this- Authorization:'Bearer token'
    so we have to skip the Bearer part to retrive the token
    we have use the split function for this.
    */

	if (req.method === 'OPTIONS') {
		return next();
	}

	try {
		const token = req.headers.authrization.split(' ')[1]; //if headers not sets, it will handle by the catch

		if (!token) {
			//console.log('no token' + req.headers.authorization);
			throw new Error('authentication failed! token error'); //msg not important, this will also handle by the catch.
		}
		//console.log('no token 2' + req.headers.authorization);
		const decodedToken = jwt.verify(token, 'cr-hunter&dasunx');
		req.userData = decodedToken.userId; // from the tokens payload,|| we have added this userId into the token's payload in Controllers

		next();
	} catch (err) {
		const error = new HttpError('authentication failed! token error' + err);

		return next(error);
	}

};
