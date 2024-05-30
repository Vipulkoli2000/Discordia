// uploadMiddleware.js
const multer = require("multer");
const AWS = require("aws-sdk");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

const spacesEndpoint = new AWS.Endpoint("blr1.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.ACESSKEY,
  secretAccessKey: process.env.SECRETACESSKEY,
  region: "blr1",
});

const uploadFileToS3 = (req, res, next) => {
  console.log("Body:", req.body); // Should show all non-file fields
  console.log("File:", req.file);
  upload(req, res, function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Error uploading file." });
    }
    // Proceed with file upload to S3 if file is present
    if (!req.file) {
      console.error("No file provided.");
      return res.status(400).json({ error: "No file provided." });
    }

    const { originalname, buffer } = req.file;

    const params = {
      Bucket: "biscord",
      Key: originalname,
      Body: buffer,
      ACL: "public-read",
    };

    s3.upload(params, function (s3Err, data) {
      if (s3Err) {
        return res.status(500).json({ error: "Error uploading file to S3." });
      }
      // File uploaded successfully, proceed to next middleware or route handler
      req.fileLocation = data.Location; // Save file location to request object
      req.fileName = originalname; // Original file name

      next();
    });
  });
};

module.exports = uploadFileToS3;
