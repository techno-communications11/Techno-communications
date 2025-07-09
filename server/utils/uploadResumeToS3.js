const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const fs = require("fs");

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadResumeToS3 = async (file) => {
  const stream = fs.createReadStream(file.path);
  const uniqueKey = `resumes/${Date.now()}_${file.originalname}`;

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueKey,
      Body: stream,
      ContentType: file.mimetype,
      ACL: 'public-read',
    },
  });

  await upload.done();
  return {
    url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${uniqueKey}`,
    key: uniqueKey,
    name: file.originalname,
    type: file.mimetype,
    size: file.size
  };
};

module.exports = uploadResumeToS3;
