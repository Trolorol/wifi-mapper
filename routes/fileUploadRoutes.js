const express = require('express');
const _ = require('lodash');
const fs = require('fs');
const multer = require('multer');
const csvParser = require('csv-parser');
const upload = multer({ dest: 'tmp/csv/' });
const uploaderModel = require('../models/uploaderModel');
const { result } = require('lodash');

var router = express.Router();


router.post('/', upload.single('file'), async function(req, res) {
    let process;
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
            console.log("Here")
            console.log(file_location)
            await uploaderModel.uploadFile(file_location);
            //process = await file_processing(file_location);
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