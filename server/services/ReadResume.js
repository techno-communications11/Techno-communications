require('dotenv').config();
const db = require('../testConnection'); // Assuming mysql2/promise
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const getResumeSignedUrl = async (req, res) => {
  console.log('Entering getResumeSignedUrl function');
  let { applicant_uuid } = req.params;
  console.log('Received applicant_uuid:', applicant_uuid);

  if (!applicant_uuid) {
    console.warn('⚠️ applicant_uuid is required');
    return res.status(400).json({ error: 'Applicant UUID is required' });
  }

  try {
    console.log('Querying database for applicant_uuid:', applicant_uuid);
    const query = `
      SELECT file_name, file_url, file_type, file_size, uploaded_at
      FROM resumes
      WHERE applicant_uuid = ?
    `;
    const [rows] = await db.query(query, [applicant_uuid]);
    console.log('Query result:', rows);

    if (!rows || rows.length === 0 || !rows[0].file_url) {
      console.warn('⚠️ No resume found for applicant_uuid:', applicant_uuid);
      return res.status(404).json({ error: 'Resume not found' });
    }

    const fileData = rows[0];
    console.log('Found file details:', fileData);

    const fileUrl = fileData.file_url;
    console.log('Parsing S3 URL:', fileUrl);
    const url = new URL(fileUrl);
    const bucket = url.hostname.split('.')[0];
    const key = decodeURIComponent(url.pathname.substring(1));
    console.log('Extracted S3 info:', { bucket, key });

    console.log('Generating S3 signed URL');
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('Generated signed URL:', signedUrl);

    return res.status(200).json({
      file_name: fileData.file_name,
      file_url: signedUrl,
      file_type: fileData.file_type,
      file_size: fileData.file_size,
      uploaded_at: fileData.uploaded_at,
    });
  } catch (error) {
    console.error('Error in getResumeSignedUrl:', error.message, error.stack);
    return res.status(500).json({ error: 'An error occurred', details: error.message });
  }
};

module.exports = { getResumeSignedUrl };