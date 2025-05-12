// hashPassword.js
import bcrypt from 'bcrypt';

const password = 'admin'; // The password to hash
const saltRounds = 10; // The number of rounds for salt

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
    } else {
        console.log('Hashed password:', hash);
    }
});