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

// MongoDB model
const pdfSchema = new mongoose.Schema({
  studentname: String,
  title: [String],
  name: String,
  size: Number,
  content: Buffer, // Store the PDF content as a Buffer
});

const PDF = mongoose.model('PDF', pdfSchema);

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Multer configuration for file upload
const storage = multer.memoryStorage(); // Store files in memory as Buffers
const upload = multer({ storage: storage });

app.use(express.json()); // Parse JSON-encoded bodies

// Upload route
app.post('/upload', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file provided' });
  }

  const { pdfTitle, studentname } = req.body;

  const pdf = new PDF({
    studentname,
    title: pdfTitle,
    name: req.file.originalname,
    size: req.file.size,
    content: req.file.buffer, // Save the PDF content as a Buffer
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

// Serve PDFs dynamically
app.get('/pdf/:id', async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    // Serve the PDF file from the database
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdf.content);
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
// Serve PDFs dynamically
app.get('/pdf/:id', async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    // Set headers for PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline'); // Set to "inline" instead of "attachment"
    res.send(pdf.content);
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
