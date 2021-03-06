const aws = require('aws-sdk')
const cognito = new aws.CognitoIdentityServiceProvider()

exports.handler = async event => {
    const bodyJson = JSON.parse(event.body);
    const authData = { 
        UserPoolId: process.env.USER_POOL_ID,
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        ClientId: process.env.CLIENT_ID,
        AuthParameters: {
        USERNAME: bodyJson.email,
        PASSWORD: bodyJson.password,
    }
  }
  const response = await cognito.adminInitiateAuth(authData).promise();
  if(response.ChallengeName){
    const confirmAuthData = { 
        UserPoolId: process.env.USER_POOL_ID,
        ClientId: process.env.CLIENT_ID,
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ChallengeResponses: {
                USERNAME: bodyJson.email,
                NEW_PASSWORD: bodyJson.password,
        },
        Session: response.Session,
    }
    const responseAfterFirstLogin = await cognito.adminRespondToAuthChallenge(confirmAuthData).promise()
    return {
        statusCode: 200,
        body: JSON.stringify(
        {
            message: responseAfterFirstLogin.AuthenticationResult.IdToken
        })
    }
  }
  else
  {
    return {
        statusCode: 200,
        body: JSON.stringify(
        {
            message: response.AuthenticationResult.IdToken
        })
    }
  }
}