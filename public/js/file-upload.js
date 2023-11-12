const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const { fromCognitoIdentityPool } = require("@aws-sdk/credential-providers")

/**
 * @param {File} file 
 */
async function uploadFile(file, key) {
    const s3 = new S3Client({
        region: "us-east-1",
        credentials: fromCognitoIdentityPool({
            identityPoolId: "us-east-1:ecb041b7-1150-478e-b82a-becb32d12f6f"
        })
    })
    const putObject = new PutObjectCommand({
        Bucket: "storyteller-sounds",
        Key: key,
        Body: file,
    })
    return await s3.send(putObject)
}

window.uploadFile = uploadFile