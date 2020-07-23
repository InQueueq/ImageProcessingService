const pg = require('pg')
var aws = require('aws-sdk');
var s3 = new aws.S3();

const pool = new pg.Pool({
    host     : process.env.dbhost,
    user     : process.env.dbuser,
    database : process.env.dbbase,
    password : process.env.dbpassword,
    port     : process.env.dbport
  });

exports.handler = (event, context, callback) =>{
    context.callbackWaitsForEmptyEventLoop = false;
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;
    const params = {
        Bucket: bucket,
        Key: key,
    };
    s3.getObject(params, function(err, data){
        if (err) callback(err)
         else {
            pool.query(`INSERT INTO images("link") VALUES('https://${params.Bucket}.s3.amazonaws.com/${params.Key}')`, (err, res) => {
                if(err) callback(err)
                else {
                    callback(null, 
                        {
                          statusCode: 200,
                          body: JSON.stringify(res)
                        })
                }
            })
        }
    });
}


