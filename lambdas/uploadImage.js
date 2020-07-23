const aws = require('aws-sdk')
const s3 = new aws.S3();

const extensions = {
    '/' : '.jpg',
    'i' : '.png'
}

exports.handler = (event, context, callback) => {
    const buffer = Buffer.from(event.base64image,'base64');
    const extension =  extensions[event.base64image.charAt(0)];
    const filePath = Date.now() + extension;
    const params = {
        "Body": buffer,
        "Bucket": process.env.bucket,
        "Key": filePath,
        "ContentType" : event.contentType,
        "ACL": 'public-read',
    };
    s3.upload(params, function (err, data) {
        if (err) {
            callback(err, null);
        } 
        else {
            const response = {
                "statusCode": 200,
                "body": data
            };
            callback(null, response);
        }
    });
}