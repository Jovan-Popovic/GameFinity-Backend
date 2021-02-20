const fs = require("fs");
const { Readable } = require("stream");
const { google } = require("googleapis");

const {
  installed: { client_id, client_secret, redirect_uris },
} = JSON.parse(fs.readFileSync(__dirname + "/credentials.json"));
const { refresh_token, scope } = JSON.parse(
  fs.readFileSync(__dirname + "/token.json")
);

const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

auth.setCredentials({ refresh_token });
auth.generateAuthUrl({ scope });

const drive = google.drive({ version: "v3", auth });

const bufferToStream = (buffer) =>
  new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });

const uploadImage = async (image) => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: "profilepic.png",
        mimeType: image.mimetype,
      },
      media: {
        mimeType: image.mimetype,
        body: bufferToStream(image.data),
      },
    });
    console.log(response.data);
  } catch (error) {
    console.log(scope);
    console.log("Error: " + error.message);
  }
};

const generatePublicUrl = () => {};
const deleteImage = () => {};

module.exports = { uploadImage, generatePublicUrl, deleteImage };
