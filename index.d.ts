import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
} from "aws-lambda";

export interface MultipartFile {
  filename: string;
  content: Buffer;
  contentType: string;
  encoding: string;
  fieldname: string;
}

export interface MultipartOptions {
  filenameCharset?: BufferEncoding;
}

export type MultipartRequest = { files: MultipartFile[] } & Record<
  string,
  string
>;

export function parse (
  event: APIGatewayProxyEvent | APIGatewayProxyEventV2,
  options?: MultipartOptions
): Promise<MultipartRequest>;
