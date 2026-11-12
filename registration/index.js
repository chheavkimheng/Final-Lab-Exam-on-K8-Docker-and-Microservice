const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

const studentSchema = new mongoose.Schema({
  Student_id: { type: String, required: true, unique: true },
  Student_name: { type: String, required: true },
  student_mobile: { type: String, required: true },
  student_email: { type: String, required: true },
  student_password: { type: String, required: true }
});

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

app.get('/health', (req, res) => res.json({ service: 'registration', status: 'ok' }));

app.post('/register', async (req, res) => {
  try {
    const { Student_id, Student_name, student_mobile, student_email, student_password } = req.body;
    const student = await Student.create({
      Student_id, Student_name, student_mobile, student_email, student_password
    });
    res.status(201).json({
      message: 'Student registered',
      Student_id: student.Student_id,
      Student_name: student.Student_name
    });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Student_id already exists' });
    res.status(400).json({ error: err.message });
  }
});

if (!MONGO_URI) {
  console.error('MONGO_URI is not set');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Registration: MongoDB connected');
    app.listen(PORT, () => console.log(`Registration service running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });