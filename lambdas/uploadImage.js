const S3 = require("aws-sdk/clients/s3");
const mime = require("mime");
const s3 = new S3();


exports.handler = (event,context,callback) => {
  const { name } = JSON.parse(event.body);
  const params = {
    Expires: 60,
    Bucket: process.env.BUCKET,
    Conditions: [["content-length-range", 100, 10000000],[ "eq", "$acl", "public-read" ]],
    Fields: {
      "Content-Type": mime.getType(name),
      key: `${event.requestContext.authorizer.claims.email}_${Date.now()}_${name}`,
    }
  };
  s3.createPresignedPost(params, function(err, data) {
    if (err) {
      callback(err)
    } else {
      callback(null, 
        {
          statusCode:200,
          body: JSON.stringify(data)
        })
    }
  });
}