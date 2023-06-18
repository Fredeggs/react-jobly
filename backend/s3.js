const {
  PutObjectCommand,
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client();
const BUCKET = process.env.BUCKET;

const uploadMOAToS3 = async ({ file, libraryId }) => {
  const key = `moas/${libraryId}/${uuidv4()}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3.send(command);
    return { key };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const getMOAKeyByLibrary = async (libraryId) => {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: `moas/${libraryId}`,
  });
  const { Contents = [] } = await s3.send(command);
  return Contents.sort(
    (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
  ).map((file) => file.Key);
};

const getMOAPresignedUrls = async (libraryId) => {
  try {
    const fileKeys = await getMOAKeyByLibrary(libraryId);
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: fileKeys[0] });
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

    return { presignedUrl };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

module.exports = { uploadMOAToS3, getMOAPresignedUrls };
