const fs = require("fs");

const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const CREDENTIALS_PATH = `${__dirname}/credentials.json`;
const TOKEN_PATH = `${__dirname}/token.json`;

// Skip next in execController
const skipNext = () => {};

// To reduce controllers
const execController = (next, data) =>
  new Promise(async (resolve, reject) => {
    try {
      await next();
      resolve(await data);
    } catch (err) {
      console.error(err);
      reject(new Error(err));
    }
  });

// Generate token.json
const getAccessToken = async (oAuth2Client) => {
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
    });
  });
};

// Authorize our Google API requests
const authorize = () =>
  new Promise((resolve, reject) => {
    try {
      fs.readFile(CREDENTIALS_PATH, (err, credentials) =>
        err
          ? console.error("Error loading client secret file:", err)
          : fs.readFile(TOKEN_PATH, async (err, token) => {
              const {
                installed: { client_secret, client_id, redirect_uris },
              } = JSON.parse(credentials);
              const auth = new google.auth.OAuth2(
                client_id,
                client_secret,
                redirect_uris[0]
              );
              auth.setCredentials(JSON.parse(token));
              err
                ? await getAccessToken(auth)
                : resolve(google.drive({ version: "v3", auth }));
            })
      );
    } catch (err) {
      console.error(err);
      reject(new Error(err));
    }
  });

// Generate public URL for uploaded images
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
    return imageUrl;
  } catch (error) {
    console.error(error);
  }
};

// Upload image to Google Drive
const uploadImage = async (image, folder) => {
  try {
    const { name, mimetype: mimeType } = image;
    const path = `${__dirname}/${name}`;
    const body = fs.createReadStream(path);
    const drive = await authorize();
    const resource = { name, parents: [folder] };
    const media = { mimeType, body };
    const fields = "id";
    fs.unlink(path, (err) => {
      if (err) throw err;
    });
    const {
      data: { id },
    } = await drive.files.create({ resource, media, fields });
    const imageUrl = await generatePublicUrl(drive, id);
    return imageUrl;
  } catch (err) {
    console.error(err);
  }
};

const updateImage = async (image, url) => {
  try {
    const { name, mimetype: mimeType } = image;
    const path = `${__dirname}/${name}`;
    const body = fs.createReadStream(path);
    const drive = await authorize();
    const media = { mimeType, body };
    const fileId = url.split("=")[--url.split("=").length];
    fs.unlink(path, (err) => {
      if (err) throw err;
    });
    return await drive.files.update({ media, fileId });
  } catch (err) {
    console.error(err);
  }
};

// Delete image from Google Drive
const deleteImage = async (url) => {
  try {
    const drive = await authorize();
    const fileId = url.split("=")[--url.split("=").length];
    const response = await drive.files.delete({ fileId });
    return response;
  } catch (error) {
    console.error(error);
  }
};

// Average rating for users and games
const averageRating = async (comment, Comment, Model) => {
  const { postedOn, postedOnId, rating = 0 } = comment;
  const ratings = [
    ...(await Comment.find({ postedOn, postedOnId }, "rating")),
    { rating: parseInt(rating) },
  ].map((comment) => comment.rating) || [0];
  const averageRating =
    Math.round(
      (ratings.reduce((rating1, rating2) => rating1 + rating2, 0) /
        (rating ? ratings.length : --ratings.length)) *
        10
    ) / 10;
  await Model.findOneAndUpdate(
    { _id: postedOnId },
    {
      $set: { rating: averageRating },
    }
  );
};

module.exports = {
  skipNext,
  execController,
  uploadImage,
  updateImage,
  deleteImage,
  averageRating,
};
