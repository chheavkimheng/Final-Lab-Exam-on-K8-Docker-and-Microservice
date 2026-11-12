const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

const studentSchema = new mongoose.Schema({
  Student_id: { type: String, required: true, unique: true },
  Student_name: { type: String, required: true },
  student_mobile: { type: String, required: true },
  student_email: { type: String, required: true },
  student_password: { type: String, required: true }
});

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

app.get('/health', (req, res) => res.json({ service: 'update-service', status: 'ok' }));

// Update mobile number and/or password of one student
app.put('/update/:id', async (req, res) => {
  try {
    const { student_mobile, student_password } = req.body;
    const changes = {};
    if (student_mobile) changes.student_mobile = student_mobile;
    if (student_password) changes.student_password = student_password;

    if (Object.keys(changes).length === 0) {
      return res.status(400).json({ error: 'Send student_mobile and/or student_password' });
    }

    const student = await Student.findOneAndUpdate(
      { Student_id: req.params.id },
      changes,
      { new: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });

    res.json({
      message: 'Student updated',
      Student_id: student.Student_id,
      student_mobile: student.student_mobile
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

if (!MONGO_URI) {
  console.error('MONGO_URI is not set');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Update service: MongoDB connected');
    app.listen(PORT, () => console.log(`Update service running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }); 