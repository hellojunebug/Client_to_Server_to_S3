const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const {
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
	S3Client,
} = require("@aws-sdk/client-s3");
require("dotenv").config();

// Initialize express and define a port
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize AWS S3 client with environment variables
let client = new S3Client({
	region: process.env.BUCKET_REGION,
	credentials: {
		accessKeyId: process.env.ACCESS_KEY,
		secretAccessKey: process.env.SECRETE_ACCESS_KEY,
	},
});

// Configure body-parser and multer for file handling
app.use(bodyParser.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the upload endpoint, which accepts a single file
app.post("/upload", upload.single("file"), async (req, res) => {
	if (!req.file) return res.status(400).send("File is required.");

	const uploadParams = {
		Bucket: process.env.BUCKET_NAME,
		Key: req.file.originalname,
		Body: req.file.buffer,
	};

	try {
		await client.send(new PutObjectCommand(uploadParams));
		res.status(200).send("File uploaded successfully");
	} catch (err) {
		console.error("Error uploading file: ", err);
		res.status(500).send(err.message);
	}
});

// Define the download endpoint, which streams a file to the client
app.get("/download/:fileName", async (req, res) => {
	const { fileName } = req.params;
	const getObjectParams = {
		Bucket: process.env.BUCKET_NAME,
		Key: fileName,
	};

	try {
		const { Body } = await client.send(
			new GetObjectCommand(getObjectParams)
		);
		Body.pipe(res);
	} catch (err) {
		console.error("Error downloading file: ", err);
		res.status(500).send(err.message);
	}
});

// Define the delete endpoint, which deletes a file from the S3 bucket
app.delete("/delete/:fileName", async (req, res) => {
	const { fileName } = req.params;
	const deleteObjectParams = {
		Bucket: process.env.BUCKET_NAME,
		Key: fileName,
	};

	try {
		await client.send(new DeleteObjectCommand(deleteObjectParams));
		res.status(200).send("File deleted successfully");
	} catch (err) {
		console.error("Error deleting file: ", err);
		res.status(500).send(err.message);
	}
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
