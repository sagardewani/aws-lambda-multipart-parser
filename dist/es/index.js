'use strict';

import busboy from "busboy";
/*
 * This module will parse the multipart-form containing files and fields from the lambda event object.
 * @param {event} - an event containing the multipart-form in the body
 * @return {object} - a JSON object containing array of files and fields, sample below.
    {
        files: [
            {
                filename: 'test.pdf',
                content: <Buffer 25 50 6f 62 ... >,
                contentType: 'application/pdf',
                encoding: '7bit',
                fieldname: 'uploadFile1'
            }
        ],
        field1: 'VALUE1',
        field2: 'VALUE2',
    }
 */
const parse = (event, options = {
  filenameCharset: 'latin1'
}) => new Promise((resolve, reject) => {
  const bb = busboy({
    headers: {
      'content-type': event.headers['content-type'] || event.headers['Content-Type']
    }
  });
  const result = {
    files: []
  };

  bb.on('file', (name, file, info) => {
    const { filename, encoding, mimeType } = info;

    const uploadFile = {};

    file.on('data', data => {
      uploadFile.content = data;
    }).on('close', () => {
      if (uploadFile.content) {
        uploadFile.filename = filename;
        uploadFile.contentType = mimeType;
        uploadFile.encoding = encoding;
        // By default, characters are considered as latin1 (ISO-8859-1) encoded
        uploadFile.fieldname = Buffer.from(name, 'latin1').toString(options.filenameCharset);
        result.files.push(uploadFile);
      }
    });
  });

  bb.on('field', (name, value, _info) => {
    result[name] = value;
  });

  bb.on('error', reject);

  bb.on('close', () => {
    resolve(result);
  });

  const encoding = event.encoding || (event.isBase64Encoded ? "base64" : "binary");
  const body = encoding === "base64" ? Buffer.from(event.body, "base64") : event.body;
  bb.end(body, encoding);
});

export default parse;