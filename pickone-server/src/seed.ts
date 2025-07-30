import mongoose from 'mongoose';
import { User } from './app/modules/user/user.model'; // Ensure this is exporting a Mongoose model
import config from './config';

async function seed() {
   try {
      // Connect to MongoDB
      await mongoose.connect(config.database_url as string);
      console.log('Connected to MongoDB.');

      // Check for existing admin
      const user = await User.findOne({ role: 'admin' });

      if (user) {
         console.log('Admin user already exists.');
         return;
      }

      // Create admin user
      // Remove manual hashing - let the user model pre-save hook handle it
      const adminUser = new User({
         name: 'Admin',
         email: 'admin@gmail.com',
         password: 'admin@', // Plain text password - model will hash it
         role: 'admin',
      });

      await adminUser.save();
      console.log('Admin user created successfully.', adminUser);
   } catch (error) {
      console.error('Error seeding admin user:', error);
   } finally {
      await mongoose.disconnect();
   }
}

seed()
   .then(() => {
      console.log('Seeding completed.');
      process.exit(0);
   })
   .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
   });

export default seed;
