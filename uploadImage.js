const S3 = require("aws-sdk/clients/s3");
const mime = require("mime");
const s3 = new S3();


exports.handler = async ({ body }) => {
  try {
    const { name } = JSON.parse(body);
    const presignedPostData = await createPresignedPost({
      key: `${Date.now()}_${name}`,
      contentType: mime.getType(name)
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: presignedPostData,
      })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: err.message
      })
    };
  }
};

const createPresignedPost = ({ key, contentType }) => {
  const params = {
    Expires: 60,
    Bucket: process.env.BUCKET,
    Conditions: [["content-length-range", 100, 10000000],[ "eq", "$acl", "public-read" ]],
    Fields: {
      "Content-Type": contentType,
      key
    }
  };

  return new Promise(async (resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};