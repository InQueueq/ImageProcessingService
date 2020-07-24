const aws = require('aws-sdk')
const cognito = new aws.CognitoIdentityServiceProvider();

exports.handler = async event => {
    try{
        const bodyJson = JSON.parse(event.body)
        await cognito.adminCreateUser({
            UserPoolId: process.env.USER_POOL_ID,
            Username: bodyJson.email,
            MessageAction: 'SUPPRESS',
            TemporaryPassword: bodyJson.password
        }).promise()
        return {
            statusCode: 200,
            body: JSON.stringify(
            {
                message: 'Success!!!'
            })
        }
    }
    catch(err){
        return {
            statusCode: 400,
            body: JSON.stringify(
              {
                message: err
              })
        }
    }
};