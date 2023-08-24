const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app); // Use the existing Express app for the server
const io = socketIO(server);

const port = process.env.PORT || 4000;

// MongoDB configuration
const MONGO_URI = 'mongodb+srv://neer:bjFBXFCYd00Gifiv@pdf-uploading-site.ges8oic.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define the MongoDB model
const pdfSchema = new mongoose.Schema({
  studentname: String,
  title: [String],
  name: String,
  size: Number,
  path: String,
});

const PDF = mongoose.model('PDF', pdfSchema);

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'uploads' folder (PDF files)



// Serve the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.use(express.json()); // Parse JSON-encoded bodies

app.post('/upload', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file provided' });
  }

  console.log('pdfTitle:', req.body.pdfTitle);
  const pdfTitle = req.body.pdfTitle;
  const studentnames = req.body.studentname; // Corrected property name
  console.log(studentnames);

  // Save the file details in the MongoDB collection
  const pdf = new PDF({
    studentname: studentnames, // Corrected property name
    title: pdfTitle,
    name: req.file.originalname,
    size: req.file.size,
    path: req.file.path,
  });

  try {
    await pdf.save();
    console.log('PDF uploaded successfully');
    res.json({ message: 'PDF uploaded successfully' });
  } catch (err) {
    console.error('Error saving PDF details:', err);
    res.status(500).json({ error: 'Failed to save PDF details' });
  }
});

// Socket.IO configuration
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', { username: msg.username, message: msg.message });
    console.log(msg.username);
    console.log({ message: msg });
  });


});

app.get('/pdfs', async (req, res) => {
  try {
    const pdfs = await PDF.find({}, 'title path');
    res.json(pdfs);
  } catch (err) {
    console.error('Error fetching PDFs:', err);
    res.status(500).json({ error: 'Failed to fetch PDFs' });
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
