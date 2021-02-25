const { exec } = require("child_process");
const fs = require("fs");

const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const TOKEN_PATH = `${__dirname}/token.json`;

// Skip next in execController
const skipNext = () => {};

// To reduce controllers
const execController = (next, data) =>
  new Promise(async (res, rej) => {
    try {
      await next();
      res(await data);
    } catch (err) {
      console.error(err);
      rej(new Error(err));
    }
  });

// Generate token.json
const getAccessToken = async (oAuth2Client, callback) => {
  const authUrl = await oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
};

// Authorize our Google API requests
const authorize = async (credentials, callback, file, folder) =>
  new Promise((res, rej) => {
    try {
      fs.readFile(TOKEN_PATH, async (err, token) => {
        const {
          client_secret,
          client_id,
          redirect_uris,
        } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
          client_id,
          client_secret,
          redirect_uris[0]
        );
        err
          ? await getAccessToken(oAuth2Client, callback)
          : oAuth2Client.setCredentials(JSON.parse(token));
        const imageUrl = await callback(oAuth2Client, file, folder);
        console.log("Final Image URL is: " + imageUrl);
        res(imageUrl);
      });
    } catch (err) {
      console.error(err);
      rej(new Error(err));
    }
  });

// Upload image to Google Drive
const uploadFile = async (auth, file, folder) => {
  try {
    const path = `${__dirname}/${file.name}`;
    const drive = google.drive({ version: "v3", auth });
    const body = fs.createReadStream(path);
    const resource = {
      name: file.name,
      parents: [folder],
    };
    const media = {
      mimeType: file.mimetype,
      body,
    };
    const fields = "id";
    fs.unlink(path, (err) => {
      if (err) throw err;
    });
    const {
      data: { id },
    } = await drive.files.create({ resource, media, fields });
    const imageUrl = await generatePublicUrl(drive, id);
    console.log("ImageURL from creation is: " + imageUrl);
    return imageUrl;
  } catch (err) {
    console.error(err);
  }
};

const generatePublicUrl = async (drive, id) => {
  try {
    const resource = {
      role: "reader",
      type: "anyone",
    };
    const fields = "id";
    const fileId = id;
    const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    await drive.permissions.create({ resource, fileId, fields });
    console.log(imageUrl);
    return imageUrl;
  } catch (error) {
    console.error(error);
  }
};

const uploadImage = async (image, folder) =>
  new Promise(async (res, rej) => {
    try {
      fs.readFile(`${__dirname}/credentials.json`, async (err, content) =>
        err
          ? console.error("Error loading client secret file:", err)
          : res(await authorize(JSON.parse(content), uploadFile, image, folder))
      );
    } catch (err) {
      console.error(err);
      rej(new Error(err));
    }
  });

/* const uploadImage = async (image, folder) =>
  execController(() => {
    fs.readFile(`${__dirname}/credentials.json`, async (err, content) =>
      err
        ? console.error("Error loading client secret file:", err)
        : console.log("Loading client secret file: ", content)
    );
  }, await authorize(JSON.parse(content), uploadFile, image, folder));
 */
// Delete image to Google Drive
const deleteImage = async (id) => {
  try {
    const response = await drive.files.delete({ fileId: id });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  skipNext,
  execController,
  uploadImage,
  deleteImage,
};
