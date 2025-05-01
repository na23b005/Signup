import mongoose from 'mongoose';

const loginSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  timestamps: true
});

const collection =new mongoose.model('user', loginSchema);
export default collection