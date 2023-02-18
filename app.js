// requring packages
const express = require('express');
const multer = require('multer');
const openai = require('openai');
const fs = require('fs');
const app = express();
const openaikey = process.env.API_KEY 
const port = process.env.PORT || 3000;
const nodemailer = require('nodemailer')

const apiKey = openaikey;
const restorer = new openai.ImageRestorer(apiKey);

// Set up the multer middleware to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './temp');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Set up the Express route to handle file uploads and image restoration
app.post('/', upload.single('image'), (req, res, next) => {
  const image = fs.readFileSync(req.file.path);
  restorer.restoreImage(image).then((result) => {

    res.render('email')
    // Set up the response headers to enable file download
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', 'attachment; filename=restored.jpg');
    res.send(result);
    // Delete the uploaded file after sending the restored image
    fs.unlinkSync(req.file.path);
  }).catch((error) => {
    console.error(error);
    next(error);
  });
});

// Set up the EJS view for uploading an image
app.get('/', (req, res) => {
    
  res.render('index');
});




// Port

app.listen(port,  () => {
  console.log('Server started on port 3000');
});
