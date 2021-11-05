const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');


// ---------------
const http = require('http');
const fs = require('fs');
const multer = require('multer');
const csv = require('fast-csv');

const upload = multer({ dest: 'tmp/csv/' });

var router = express.Router();

// const fileRows = [];
// csv.fromPath(req.file.path)
//     .on("data", function(data) {
//         fileRows.push(data); // push each row
//     })
//     .on("end", function() {
//         console.log(fileRows) //contains array of arrays. Each inner array represents row of the csv file, with each element of it a column
//         fs.unlinkSync(req.file.path); // remove temp file
//         //process "fileRows" and respond
//     })

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
            const process = await file_processing(file_location);
        }
        res.send({
            status: true,
            message: 'File is uploaded',
            data: {
                process
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }

});


function file_processing(file) {
    let promise = new Promise(function(resolve, reject) {

        setTimeout(() => resolve("done!"), 1000);
    });

    // resolve runs the first function in .then
    promise.then(
        result => alert(result), // shows "done!" after 1 second
        error => alert(error) // doesn't run
    )
};





// router.post('/', async(req, res) => {
//     try {
//         if (!req.files) {
//             res.send({
//                 status: false,
//                 message: 'No file uploaded'
//             });
//         } else {
//             let file = req.files.file;
//             file.mv('./uploads/' + file.name);
//             res.send({
//                 status: true,
//                 message: 'File is uploaded',
//                 data: {
//                     name: file.name,
//                     mimetype: file.mimetype,
//                     size: file.size
//                 }
//             });
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

module.exports = router;