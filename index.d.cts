declare module "lambda-multipart-data-parser" {
    import {
        APIGatewayProxyEvent,
        APIGatewayProxyEventV2,
    } from "aws-lambda";
    
    interface MultipartFile {
        filename: string
        content: Buffer
        contentType: string
        encoding: string
        fieldname: string
    }

    interface MultipartOptions {
        filenameCharset?: BufferEncoding;
    }

    type MultipartRequest = { files: MultipartFile[] } & Record<string, string>

    export function parse (event: APIGatewayProxyEvent | APIGatewayProxyEventV2, options?: MultipartOptions): Promise<MultipartRequest>
}
