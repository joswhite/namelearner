// To upload your files,
// 1. Run node ./dist/server/upload.js
// 2. Upload all at once at localhost:8040
// 3.
// Note: choose the group name to be the child directory in form.uploadDir.

import * as formidable from 'formidable';
let http = require('http'),
	util = require('util');

http.createServer(function(req, res) {
	if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
		// parse a file upload
		let form = new formidable.IncomingForm();
		form.uploadDir = './dist/client/images/Provo_MS_31st';
		form.keepExtensions = true;
		form.on('fileBegin', function(name, file) {
			file.path = form.uploadDir + '/' + file.name;
		});

		form.parse(req, function(err, fields, files) {
			res.writeHead(200, {'content-type': 'text/plain'});
			res.write('received upload:\n\n');
			res.end(util.inspect({fields: fields, files: files}));
		});

		return;
	}

	// show a file upload form
	res.writeHead(200, {'content-type': 'text/html'});
	res.end(
		'<form action="/upload" enctype="multipart/form-data" method="post">'+
		'<input type="text" name="title"><br>'+
		'<input type="file" name="upload" multiple="multiple"><br>'+
		'<input type="submit" value="Upload">'+
		'</form>'
	);
}).listen(8040);