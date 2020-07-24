const pg = require('pg')
var aws = require('aws-sdk');
var s3 = new aws.S3();

const pool = new pg.Pool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    database : process.env.DB_BASE,
    password : process.env.DB_PASSWORD,
    port     : process.env.DB_PORT
  });
  

exports.handler = async (event, context) =>{
    try{
        context.callbackWaitsForEmptyEventLoop = false;
        const bucket = event.Records[0].s3.bucket.name;
        const key = event.Records[0].s3.object.key;
        const params = {
            Bucket: bucket,
            Key: key,
        };
        const data = await s3.getObject(params).promise();
        if(data){
            const res = await pool.query(`INSERT INTO images("link") VALUES('https://${params.Bucket}.s3.amazonaws.com/${params.Key}')`)
            return {
                statusCode: 200,
                body: JSON.stringify(res)
            }
        }
    }catch(err){
        return {
            statusCode: 500,
            body: JSON.stringify(
              {
                message: err
              })
        }
    }
}


