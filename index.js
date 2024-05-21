const express = require('express');
const cors = require('cors');
const vader = require('vader-sentiment');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { upload} = require('./tables/db'); // Import from db.js
const { Table } = require('./tables/db');
const pdf = require('pdf-parse');
const fs=require('fs');
const bcrypt=require('bcryptjs');
require('dotenv').config();
const path=require('path')
const app = express();
const jwt=require('jsonwebtoken')
let gfs, gridfsBucket;
const JWT_TOKEN="yuviabhi00";
mongoose.connect(process.env.URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true

});
const connection = mongoose.connection;
connection.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: "uploads"
    });
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection('uploads');
});
app.use(cors());
app.use(bodyParser.json());
const usermiddleware=(req,res,next)=>{
  const token = req.header('token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_TOKEN);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}
const ensureGfsAndBucketInitialized = (req, res, next) => {
  if (!gfs || !gridfsBucket) {
    console.error('GridFS or GridFS Bucket not initialized');
    return res.status(500).json({ error: 'GridFS or GridFS Bucket is not initialized' });
  }
  next();
}
app.post('/sign',async(req,res)=>{
  const a=await Table.findOne({name:req.body.name});
  if(a){
    res.status('500').json({msg:"user exist already"});
  }
  else{
    const salt=await bcrypt.genSalt(10);
    const secp=await bcrypt.hash(req.body.password,salt);
    const user=await Table.create({
      name:req.body.name,
      password:secp
    })
    const payload={
      user:{
        id:user.id
      }
    }
const authtoken=jwt.sign(payload,JWT_TOKEN);
success=true;
res.json({success,authtoken});
  }
})
app.post('/login',async(req,res)=>{
  let user=await Table.findOne({name:req.body.name});
  if(!user){
    res.status('500').json({msg:"invalid user"});
  }
  else{
   let comp=await bcrypt.compare(req.body.password,user.password);
   if(!comp)
    {
      res.status('500').json({msg:"invalid creds"});
    }

    else{
    const data={
      user:{
        id:user.id
      }
    }
const authtoken=jwt.sign(data,JWT_TOKEN);
success=true;
res.json({success,authtoken});
  }
}
})
app.post('/addPdf',upload.single('file'),usermiddleware, async (req, res) => {
  try {
    if (!req.file) {
      if(!req.body.text){
        return res.status(400).json({ error: "No file uploaded" });
      }
    }
   
    userId = req.user.id;
    const newEntry = await Table.findById(userId);
     if(!newEntry){
      res.json({msg:"nooo user"})
     }
     if(req.body.text){
      newEntry.plain_txt=req.body.text;
      console.log(newEntry);
      console.log('here');
      await newEntry.save();
     }
     else{
    newEntry.fileId=req.file.id ;
    console.log(newEntry);
   await newEntry.save();
     }

    res.status(200).json({ message: "PDF file added successfully" });
  } catch (err) {
    console.error('Error in /addPdf:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});
const processPdfFile = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

// Helper function to read and process text files
const processTxtFile = async (filePath) => {
  return fs.readFileSync(filePath, 'utf8');
}
// Route to serve the uploaded file to the user
app.get('/download/:id',usermiddleware,ensureGfsAndBucketInitialized, async (req, res) => {
  try {
    const fileI = req.params.id;
    
    // Find the file in the database
    const file = await Table.findOne({ _id:fileI });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    if(file.plain_txt){
      const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(file.plain_txt);
      return res.json({content:file.plain_txt,msg:intensity});
    }
    // Create a read stream from GridFS and pipe it to the response
    var readStream = gridfsBucket.openDownloadStream(new mongoose.Types.ObjectId(file.fileId));
  
    const documents = await gridfsBucket.find({ _id:file.fileId }).toArray();
    let a=documents[0].contentType;
    const outputPath = path.join('./tables', 'temp-file');
    const writeStream = fs.createWriteStream(outputPath);
    readStream.pipe(writeStream);
    writeStream.on('finish', async () => {
      try {
        // Read the content of the temporary file
       
        const dataBuffer = fs.readFileSync(outputPath);
let textContent;
console.log(a);
        if(a==='application/pdf'){
        textContent =await processPdfFile(outputPath);
        console.log('heree')
        }
        else if(a==='text/plain' || a=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
          textContent=await processTxtFile(outputPath);
        }
        else{
          // Send response
          return res.json({ msg:"none"});
        }
        // Clean up the temporary file
       
        const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(textContent);
        console.log(intensity);
        res.json({ content: textContent, msg: intensity });
        fs.unlinkSync(outputPath);
      } catch (err) {
        console.error('Error processing PDF:', err);
        res.status(500).json({ error: 'Error processing PDF' });
      }
    });

    writeStream.on('error', (err) => {
      console.error('Error writing temporary file:', err);
      res.status(500).json({ error: 'Error writing temporary file' });
    });

  }  catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
