const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const getFileType = (mimetype) => {
  if (mimetype.includes("pdf")) return "pdf";
  if (mimetype.includes("msword")) return "doc";
  if (mimetype.includes("wordprocessingml.document")) return "docx";
  throw new Error("Unsupported file type");
};

const uploadResumeForApplicant = async ({ file, applicant_uuid, uploaded_by = null, db }) => {
  if (!file) return;

  const fileExtension = path.extname(file.originalname);
  const s3Key = `resumes/${Date.now()}_${applicant_uuid}${fileExtension}`;

  try {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await s3.send(new PutObjectCommand(uploadParams));
    const file_url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${s3Key}`;

    try {
      await db.query(
        `INSERT INTO resumes (applicant_uuid, file_name, file_url, file_type, file_size)
         VALUES (?, ?, ?, ?, ?)`,
        [
          applicant_uuid,
          file.originalname,
          file_url,
          getFileType(file.mimetype),
          file.size,
          uploaded_by,
        ]
      );
    } catch (dbError) {
      await s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: s3Key }));
      throw dbError;
    }
  } catch (s3Error) {
    throw new Error(`S3 Upload Error: ${s3Error.message}`);
  }
};

module.exports = { uploadResumeForApplicant };