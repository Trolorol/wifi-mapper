async function uploadFile() {
    try {
        var form = new FormData();
        var file = document.getElementById('file_upload');
        form.append("file", file.files[0], file.files[0].name);


        var settings = {
            "url": "/api/file_upload",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };


        await $.ajax(settings).done(function(response) {
            console.log(response);
        });
    } catch (err) {
        document.getElementById("msg").innerText = err.responseJSON.msg;
    }
}