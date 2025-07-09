const db = require('../testConnection');
const crypto = require('crypto');
const { uploadResumeForApplicant } = require("../services/resumeService");

const generateShortID = (name, phoneNumber, currentYear) => {
    const rawString = `${name}-${phoneNumber}-${currentYear}`;
    const hash = crypto.createHash('md5').update(rawString).digest('hex');
    // Take the first 8 characters to ensure it's under 10 characters
    return hash.substring(0, 8).toUpperCase();
};

const createApplicantReferral = async (req, res) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { name, email, phone, referred_by, reference_id, sourcedBy, work_location } = req.body;
    const file = req.file; // from multer
    const currentYear = new Date().getFullYear();
    const uuid = generateShortID(name, phone, currentYear);
     console.log(file);
      console.log(req.body);

    // 1. Validate location
    const [locationResult] = await connection.query(
      'SELECT id FROM work_locations WHERE location_name = ?',
      [work_location]
    );
    if (locationResult.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Invalid work location' });
    }
    const locationId = locationResult[0].id;

    // 2. Duplicate check
    const [existing] = await connection.query(
      'SELECT id FROM applicant_referrals WHERE phone = ?',
      [phone]
    );
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Applicant already exists' });
    }

    // 3. Insert applicant
    await connection.query(
      `INSERT INTO applicant_referrals 
        (applicant_uuid, name, email, phone, referred_by, sourced_by, reference_id, work_location, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [uuid, name, email, phone, referred_by, sourcedBy, reference_id, locationId]
    );

    // 4. Call resume upload service
    if (file) {
      await uploadResumeForApplicant({
        file,
        applicant_uuid: uuid,
        uploaded_by: req.user?.id || null,
        db: connection,
      });
    }

    await connection.commit();
    res.status(201).json({ message: "Referral + Resume created", applicant_uuid: uuid });

  } catch (error) {
    await connection.rollback();
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  } finally {
    connection.release();
  }
};



const updatemail = async (req, res) => {
    const { applicant_uuid, email } = req.body; // Ensure you receive the unique identifier (like applicant_uuid)

    // console.log(email, applicant_uuid);

    try {
        // Perform the SQL query to update the email in the applicant_referrals table
        const result = await db.query(
            `UPDATE applicant_referrals
         SET email = ? 
         WHERE applicant_uuid = ?`,
            [email, applicant_uuid] // Using parameterized queries to prevent SQL injection
        );
        const affectedRows = result[0]?.affectedRows; // Access the 'affectedRows' inside the first object of the array

        // Check if the query successfully affected any rows
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Email updated successfully.' });
        } else {
            res.status(404).json({ message: 'Applicant not found or no changes made.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating email.' });
    }
};


module.exports = { createApplicantReferral, updatemail };
