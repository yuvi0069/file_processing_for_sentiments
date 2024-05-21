const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
require('dotenv').config();
mongoose.connect(process.env.URL);
const connection = mongoose.connection;

let gfs, gridfsBucket;
const storage = new GridFsStorage({
    url: process.env.URL,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads'
        };
    }
});

const upload = multer({ storage });

const TableSchema = new mongoose.Schema({
    name: String,
    password:String,
    plain_txt:String,
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GridFSFile'
    }
});

const Table = mongoose.model('Table', TableSchema);

module.exports = { Table, upload, connection, gfs, gridfsBucket};
