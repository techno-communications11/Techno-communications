const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

(async () => {
    try {
        // MySQL connection setup
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });

        // Example new passwords for users
        const usersWithNewPasswords = [
           
            { id: 234, password: 'password123' },
            


        ];

        for (const user of usersWithNewPasswords) {
            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            console.log("hashedPassword::", hashedPassword)
            // Update the password in the database
            const [result] = await db.query(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashedPassword, user.id]
            );

            if (result.affectedRows > 0) {
                console.log(`Password for user ID ${user.id} updated successfully.`);
            } else {
                console.log(`User ID ${user.id} not found.`);
            }
        }

        await db.end(); // Close the connection
    } catch (error) {
        console.error('Error updating passwords:', error);
    }
})();
