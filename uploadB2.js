require('dotenv').config();
const B2 = require('backblaze-b2');

const b2 = new B2({
   applicationKeyId: process.env.KEY_ID,
   applicationKey: process.env.APPLICATION_KEY,
});

async function uploadB2(req, res, next) {
   console.log(req.file);
   const bucketId = process.env.BUCKET_ID;
   const bucketName = 'asf-sadakah';

   try {
      // Authorize with Backblaze B2
      const authResponse = await b2.authorize();
      const { downloadUrl } = authResponse.data;

      //get bucket id
      const res = await b2.getUploadUrl({ bucketId });
      const { authorizationToken, uploadUrl } = res.data;

      // Upload the file to Backblaze B2
      const fileInfo = await b2.uploadFile({
         uploadUrl,
         uploadAuthToken: authorizationToken,
         filename: `sadakah/${req.file.originalname}`,
         data: req.file.buffer,
      });

      const url = `${downloadUrl}/file/${bucketName}/${fileInfo.data.fileName}`;

      req.locals = { url };
      next();
   } catch (error) {
      console.error('Error uploading file:', error);
   }
}

module.exports = uploadB2;
