const Server = require("../Schema/serverSchema");
const Channel = require("../Schema/channelSchema");
const AWS = require("aws-sdk");
const multer = require("multer");
const uploadFileToS3 = require("../Middlewares/upload");
const Channels = require("../Schema/channelSchema");

const spacesEndpoint = new AWS.Endpoint("blr1.digitaloceanspaces.com"); // Change 'nyc3' to your space's region
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,

  accessKeyId: process.env.ACESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: "blr1", // This can stay as is, DO Spaces uses this region by default
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function saveServer(res, serverName, req, originalname, fileLocation) {
  const newServer = new Server({
    serverName,
    owner: req.user._id,
    Serverpic: originalname, // This will be an empty string if no file was provided
    members: [req.user._id],
    creationDate: Date.now(),
  });

  await newServer.save();

  const newChannel = new Channel({
    server: newServer._id,
    channelName: "general",
    channelType: "text",
    creationDate: Date.now(),
    index: 1,
  });
  await newChannel.save();
  console.log(newChannel);

  // Send a single response here
  res.status(201).json({
    message: "Server created successfully!",
    serverId: newServer._id,
    fileLocation: fileLocation, // This will be an empty string if no file was provided
  });
}

const serverController = {
  createServer: async (req, res, next) => {
    console.log("ASD");
    try {
      const { serverName } = req.body;
      // Initialize `originalname` and `buffer` with defaults
      let originalname = "";
      let buffer = null;

      // Check if file is provided and set variables accordingly
      if (req.file) {
        originalname = req.file.originalname;
        buffer = req.file.buffer;
      }

      console.log(serverName);
      if (!serverName) {
        return res.status(400).json({ message: "Server name is required." });
      }

      // Proceed with the file upload if a file was provided
      if (req.file) {
        const params = {
          Bucket: "biscord", // The name of your DO Space
          Key: originalname, // File name you want to save as in DO Space
          Body: buffer,
          ACL: "public-read", // Make file publicly readable
        };

        s3.upload(params, async function (err, data) {
          if (err) {
            console.log("Error", err);
            return res.status(500).send("File upload failed");
          } else {
            console.log("Upload Success", data.Location);
            // Proceed to save server with the file location
            await saveServer(res, serverName, req, originalname, data.Location);
          }
        });
      } else {
        // If no file is provided, proceed to save server with an empty string for the image
        await saveServer(res, serverName, req, originalname, "");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  joinServer: async (req, res, next) => {
    try {
      const { serverId } = req.params;
      const user = req.user._id;

      console.log(serverId, user);

      const server = await Server.findById(serverId);

      if (!server) {
        return res.status(404).json({ message: "Server not found." });
      }
      if (server.members.includes(user)) {
        console.log(server);

        return res.status(400).json({ message: "User already in server." });
      }
      //add the user to the server members array

      server.members.push(user);
      console.log(server);

      await server.save();

      res.status(201).json({
        message: "Server Joined sucessfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  getUserServers: async (req, res, next) => {
    try {
      const userId = req.user._id;

      const servers = await Server.find({ members: userId });

      res.json(servers);
    } catch (error) {
      console.error(error); // Log error
      res.status(500).json({ error: error.message });
    }
  },
  getServerDetails: async (req, res, next) => {
    try {
      const { serverId } = req.params;
      const server = await Server.findById(serverId);

      if (!server) {
        return res.status(404).json({ message: "Server not found." });
      }

      res.json(server);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateServer: async (req, res, next) => {
    try {
      const { serverId } = req.params;
      const { serverName, description } = req.body;
      const userId = req.user._id;

      const server = await Server.findById(serverId);

      if (!server) {
        return res.status(404).json({ message: "Server not found." });
      }

      // Check if the requesting user is the owner of the server
      if (server.owner.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ message: "User is not authorized to update this server." });
      }

      server.serverName = serverName;
      server.description = description;
      await server.save();

      res.json({ message: "Server updated successfully.", server });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteServer: async (req, res, next) => {
    try {
      const { serverId } = req.params;
      const userId = req.user._id;

      const server = await Server.findById(serverId);

      if (!server) {
        return res.status(404).json({ message: "Server not found." });
      }

      // Check if the requesting user is the owner of the server
      if (server.owner.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ message: "User is not authorized to delete this server." });
      }

      await server.remove();

      res.json({ message: "Server deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = serverController;
