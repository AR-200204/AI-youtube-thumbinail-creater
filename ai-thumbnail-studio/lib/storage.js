import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT || undefined,
  s3ForcePathStyle: !!process.env.S3_ENDPOINT,
});

export async function uploadToS3(buffer, key, contentType = "image/png") {
  if (!process.env.S3_BUCKET) {
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  }
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read",
  };
  await s3.putObject(params).promise();
  const url = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
  return url;
}
