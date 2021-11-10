const express = require('express');
const _ = require('lodash');
const fs = require('fs');
const multer = require('multer');
const csvParser = require('csv-parser');
const csv = require("fast-csv")


const upload = multer({ dest: 'tmp/csv/' });

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
            process = await file_processing(file_location);
        }
        res.send({
            status: true,
            message: 'File is uploaded',
            data: { process }
        });
    } catch (err) {
        res.status(500).send(err);
    }

});



async function file_processing(file) {

    var stream = fs.createReadStream(file);

    csv
        .parseStream(stream, { headers: true })
        .on("data", function(data) {
            console.log('I am one line of data', data);
        })
        .on("end", function() {
            console.log("done");
        });
}

// This works
// async function file_processing(file) {
//     var output_arr = [];
//     fs.createReadStream(file)
//         .on('error', () => {
//             // handle error
//         })

//     .pipe(csvParser())
//         .on('data', (row) => {

//             output_arr.push(row);

//         })

//     .on('end', () => {
//         console.log(output_arr);
//     })
//     console.log("#########");
//     //console.log(output_arr);
// }


module.exports = router;