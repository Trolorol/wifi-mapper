const express = require('express');
const _ = require('lodash');
const fs = require('fs');
const multer = require('multer');
const csvParser = require('csv-parser');
const csv = require("fast-csv")
const uploaderModel = require('../models/uploaderModel');


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


// async function file_processing(file) {
//     let arr = [];
//     var stream = fs.createReadStream(file);

//     csv.parseStream(stream, { headers: true })
//         .on("data", function(data) {
//             arr.push(data);
//         })
//         .on("end", function() {
//             let result = await uploaderModel.uploadFile(data)
//         });
// }



// Output:
// I am one line of data { A: 'A1', B: 'B1', C: 'C1', D: 'D1', E: 'E1' }
// I am one line of data { A: 'A2', B: 'B2', C: 'C2', D: 'D2', E: 'E2' }
// I am one line of data { A: 'A3', B: 'B3', C: 'C3', D: 'D3', E: 'E3' }
// I am one line of data { A: 'A4', B: 'B4', C: 'C4', D: 'D4', E: 'E4' }
// I am one line of data { A: 'A5', B: 'B5', C: 'C5', D: 'D5', E: 'E5' }
// I am one line of data { A: 'A6', B: 'B6', C: 'C6', D: 'D6', E: 'E6' }
// I am one line of data { A: 'A7', B: 'B7', C: 'C7', D: 'D7', E: 'E7' }
// I am one line of data { A: 'A8', B: 'B8', C: 'C8', D: 'D8', E: 'E8' }
// I am one line of data { A: 'A9', B: 'B9', C: 'C9', D: 'D9', E: 'E9' }
// I am one line of data { A: 'A10', B: 'B10', C: 'C10', D: 'D10', E: 'E10' }
// I am one line of data { A: 'A11', B: 'B11', C: 'C11', D: 'D11', E: 'E11' }
// I am one line of data { A: 'A12', B: 'B12', C: 'C12', D: 'D12', E: 'E12' }
// I am one line of data { A: 'A13', B: 'B13', C: 'C13', D: 'D13', E: 'E13' }
// I am one line of data { A: 'A14', B: 'B14', C: 'C14', D: 'D14', E: 'E14' }
// I am one line of data { A: 'A15', B: 'B15', C: 'C15', D: 'D15', E: 'E15' }
// I am one line of data { A: 'A16', B: 'B16', C: 'C16', D: 'D16', E: 'E16' }
// I am one line of data { A: 'A17', B: 'B17', C: 'C17', D: 'D17', E: 'E17' }
// I am one line of data { A: 'A18', B: 'B18', C: 'C18', D: 'D18', E: 'E18' }
// I am one line of data { A: 'A19', B: 'B19', C: 'C19', D: 'D19', E: 'E19' }
// I am one line of data { A: 'A20', B: 'B20', C: 'C20', D: 'D20', E: 'E20' }
// I am one line of data { A: 'A21', B: 'B21', C: 'C21', D: 'D21', E: 'E21' }
// I am one line of data { A: 'A22', B: 'B22', C: 'C22', D: 'D22', E: 'E22' }
// I am one line of data { A: 'A23', B: 'B23', C: 'C23', D: 'D23', E: 'E23' }
// I am one line of data { A: 'A24', B: 'B24', C: 'C24', D: 'D24', E: 'E24' }
// done

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