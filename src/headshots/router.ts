import express from 'express';
import multer, { Multer } from 'multer';
import axios from 'axios';

import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

const headshotsRouter = express.Router();

import {
    startTraining,
    checkTrainingProgress,
    createAiPhotos,
    retrieveAiPhotos
} from './service'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

const upload = multer({ storage: storage });


headshotsRouter.post('/start-training', upload.array('photos', 3), async (req, res) => {
    res.status(200);
    console.log(req.files);


    const files = req.files as Express.Multer.File[];

  // Create the uploads directory if it does not exist
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Create a ZIP file
  const zipName = 'photos.zip';
  const zipPath = path.join(uploadsDir, zipName);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
  });

  output.on('close', () => {
    console.log('ZIP file created:', zipName);
    // res.download(zipPath); // Download the ZIP file after it has been created
  });

  archive.pipe(output);

  files.forEach((file) => {
    // Add each file to the ZIP archive
    archive.append(fs.createReadStream(file.path), { name: file.originalname });
  });

  archive.finalize(); // Finalize the ZIP archive

    //   upload zip 
    const TOKEN = process.env.REPLICATE_API_TOKEN;
    const response = await axios.post('https://dreambooth-api-experimental.replicate.com/v1/upload', {
        data: '/uploads/photos.zip'
    }, {
        headers: {
            "Content-Type": "application/zip",
            'Authorization': `Bearer ${TOKEN}`
        }
    });


    res.send('photos successfully uploaded, training in progress ...');
});


headshotsRouter.get('/check-training-status', (req, res) => {
    res.status(200);
    res.send('check-training-status');
});

headshotsRouter.post('/create-ai-photos', (req, res) => {
    res.status(200);
    res.send('create-ai-photos');
});

headshotsRouter.get('/retrieve-ai-photos', (req, res) => {
    res.status(200);
    res.send('retrieve-ai-photos');
});

export default headshotsRouter;