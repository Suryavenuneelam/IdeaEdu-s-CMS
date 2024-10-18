// const express = require('express');
// const bcrypt = require('bcrypt');
// const {User} = require('./models/userDetails'); // Your user model
// const router = express.Router();

// router.post('/password-reset', async (req, res) => {
//     const { phoneNumber, newPassword } = req.body;

//     try {
//         // Check if the user exists
//         const user = await User.findOne({ phoneNumber });
//         if (!user) {
//             return res.status(404).json({ message: 'No account found with this phone number.' });
//         }

//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         // Update the user's password
//         user.password = hashedPassword;
//         await user.save();

//         return res.status(200).json({ message: 'Password reset successful!' });
//     } catch (error) {
//         console.error(error); // Log the error for debugging
//         return res.status(500).json({ message: 'An error occurred. Please try again.' });
//     }
// });

// module.exports = router;
