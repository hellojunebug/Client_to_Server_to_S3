S3 File Operations Server

This Node.js server provides a simple API for performing create, read, update, and delete (CRUD) operations on an AWS S3 bucket.

    File upload to S3 Bucket
    Overwrite existing file from S3 Bucket
    File download from S3 Bucket
    File deletion from S3 Bucket


The server exposes three endpoints:

    POST /upload - for uploading or replacing files to S3.
    GET /download/:fileName - for downloading files from S3.
    DELETE /delete/:fileName - for deleting files from S3.
