const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'tmp/csv/' });
const uploaderModel = require('../models/uploaderModel');
const { result } = require('lodash');

var router = express.Router();


router.post('/', upload.single('file'), async function(req, res) {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let file = req.files.file;
            file.mv('./uploads/' + file.name);
            let file_location = './uploads/' + file.name
            await uploaderModel.uploadFile(file_location);
        }
        res.send({
            status: true,
            message: 'File is uploaded',
            status: result.status
        });
    } catch (err) {
        res.status(500).send(err);
    }
});
module.exports = router;