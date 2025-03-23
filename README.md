# lambda-multipart-data-parser

```
npm install lambda-multipart-data-parser --save
```

## Introduction

This nodejs module is the fork of [lambda-multipart-parser](https://github.com/francismeynard/lambda-multipart-parser.git "lambda-multipart-parser") with upgrades in busboy and test framework, this module is mainly for parsing the multipart-form containing files and fields from the AWS lambda event object. It works well with parsing **binary** and text files.

## Description

```
@param {event} - an event containing the multipart-form in the body
@return {object} - a JSON object containing array of files and fields, sample below.

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
```

## Usage

```
const parser = require('lambda-multipart-data-parser');

const result = await parser.parse(event);
console.log(result.files);
```

## Non-latin filenames

Example: If you want to parse a file where custom filename (or **fieldname**) is beyond latin1 (ISO-8599-1) character set.
**fieldname: ทดสอบ.txt**
This can be defined via options

```
const parser = require('lambda-multipart-data-parser');

const options = {
  filenameCharset: 'utf-8'
}

const result = await parser.parse(event, options);
const file = result.files[0];

console.log(file);

Output:
(log)
{
  content: <Buffer 25 50 ... bytes>,
  filename: 'test.txt',
  contentType: 'text/plain',
  encoding: '7bit',
  fieldname: 'ทดสอบ.txt'
}
```

## Typescript Support and ES6+ compatible:

You should use

```
import * as parser from 'lambda-multipart-data-parset';

const body = await parser.parse(event);
```

```
options: MultipartOptions
  - { filenameCharset?: BufferEncoding }
```

**Important**
Please make sure to enable the "**Use Lambda Proxy integration**" in API Gateway method Integration request.

If decided not to enable it for some reason, make sure to pass the required Lambda event parameters in Integration Request -> Mapping Templates section, such as body, headers and isBase64Encoded flag.

Sample Lambda and API Gateway implementation with Cloudformation (**coming soon**).

## Test

```
npm run test
```

## Releases / Changelogs

0.0.1 - Initial stable release.

0.0.2 - Updated readme. Added Usage and link to sample implementation.

1.0.0 - Formalized package release version. Add utf8 support.

1.0.1 - Added support for TypeScript typings.

1.0.2 - Fork with resolved issues.
  * Upgraded busboy to latest version 1.6.0
	* Added support of Jest framework for testing.

1.0.3 - Added ES6 Support, UTF8 based test, and README updates
  * Added es6 as default export
  * Updated README
  * Added utf8 fieldname based test
  * Added `dist` folder to server `cjs` and `es` convention based scripts
  * Moved commonJS convention based file to `/dist/cjs` and esm convention based file to `/dist/es`
