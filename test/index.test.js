const { parse } = require('../dist/cjs/index.cjs');

describe('Multipart Parser', () => {
    let mockEvent;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    it('should parse multipart form-data successfully given raw multipart form data', async () => {
      const body = [
        '------WebKitFormBoundaryDP6Z1qHQSzB6Pf8c',
        'Content-Disposition: form-data; name="uploadFile1"; filename="test.txt"',
        'Content-Type: text/plain',
        '',
        'Hello World!',
        '------WebKitFormBoundaryDP6Z1qHQSzB6Pf8c--'
      ].join('\r\n');

      mockEvent = {
        headers: {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryDP6Z1qHQSzB6Pf8c"
        },
        body,
        isBase64Encoded: false
      };

      const parsePromise = parse(mockEvent);

      const result = await parsePromise;

      expect(result.files).toHaveLength(1);

      const file = result.files[0];

      expect(file.filename).toEqual('test.txt');
      expect(file.contentType).toEqual('text/plain');
      expect(file.encoding).toEqual('7bit');
      expect(file.fieldname).toEqual('uploadFile1');
    });

    it('should parse multipart form-data successfully given base64 encoded form data', async () => {
        // Mock File
        const body = `LS0tLS0tV2ViS2l0Rm9ybUJvdW5kYXJ5N01BNFlXeGtUclp1MGdXDQpDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9InVwbG9hZEZpbGUxIjsgZmlsZW5hbWU9InRlc3QudHh0Ig0KQ29udGVudC1UeXBlOiB0ZXh0L3BsYWluDQoNCkhlbGxvIFdvcmxkIQ0KLS0tLS0tV2ViS2l0Rm9ybUJvdW5kYXJ5N01BNFlXeGtUclp1MGdXDQpDb250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9InVwbG9hZEZpbGUyIjsgZmlsZW5hbWU9IiINCkNvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtDQoNCg0KLS0tLS0tV2ViS2l0Rm9ybUJvdW5kYXJ5N01BNFlXeGtUclp1MGdXLS0=`
        // Mock Event
        mockEvent = {
          headers: {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
          },
          body,
          isBase64Encoded: true
        };

        // Start parsing
        const parsePromise = parse(mockEvent);

        const result = await parsePromise;

        expect(result.files).toHaveLength(1);

        const file = result.files[0];

        expect(file.filename).toEqual('test.txt');
        expect(file.contentType).toEqual('text/plain');
        expect(file.encoding).toEqual('7bit');
        expect(file.fieldname).toEqual('uploadFile1');
    });

    it('should parse multipart form-data successfully given utf8 encoded form data', async () => {
        const html = "<p>Test this paragraph.</p>";
        mockEvent = {
          headers: {
              'content-type': 'multipart/form-data; boundary=xYzZY'
          },
          body: `--xYzZY\r\nContent-Disposition: form-data; name="html"\r\n\r\n${html}\r\n--xYzZY--\r\n`,
          encoding: 'utf8'
        };

        const parsePromise = parse(mockEvent);

        const result = await parsePromise;

        expect(result.html).toEqual(html);

    });

    it('should parse multipart form-data successfully given base64 multipart form data with utf8 charset based fieldname', async () => {
      const body = `LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTc3NzIzOTMxNDA0OTcxNDE3NTMxMjEyNw0KQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPSLguJfguJTguKrguK0udHh0IjsgZmlsZW5hbWU9InRlc3QudHh0Ig0KQ29udGVudC1UeXBlOiB0ZXh0L3BsYWluDQoNCkhlbGxvIFdvcmxkDQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tNzc3MjM5MzE0MDQ5NzE0MTc1MzEyMTI3LS0=`;

      mockEvent = {
        headers: {
          "Content-Type": "multipart/form-data; boundary=--------------------------777239314049714175312127"
        },
        body,
        isBase64Encoded: true
      };

      const parsePromise = parse(mockEvent);

      const result = await parsePromise;

      expect(result.files).toHaveLength(1);

      const file = result.files[0];

      expect(file.filename).toEqual('test.txt');
      expect(file.contentType).toEqual('text/plain');
      expect(file.encoding).toEqual('7bit');
      expect(file.fieldname).toEqual(Buffer.from('ทดสอ.txt', 'utf-8').toString('latin1'));
    });

    it('should handle errors correctly', async () => {
        mockEvent = {
          headers: {
              'content-type': 'multipart/form-data; boundary=xYzZY'
          },
          body: '',
          encoding: 'utf8',
        };

        const parsePromise = parse(mockEvent, { filenameCharset: 'utf8' });

        await expect(parsePromise).rejects.toThrow('Unexpected end of form');
    });
}); 