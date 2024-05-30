var express = require("express");
var router = express.Router();
const serverController = require("../controller/serverController");
const { isAuthenticated } = require("../Middlewares/Auth");
const uploadFileToS3 = require("../Middlewares/upload");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post(
  "/createserver",
  upload,
  isAuthenticated,
  serverController.createServer
);
router.post("/join/:serverId", isAuthenticated, serverController.joinServer);
router.get("/servers", isAuthenticated, serverController.getUserServers);
router.get("/servers/:serverId", serverController.getServerDetails);
router.put("/servers/:serverId", serverController.updateServer);
router.delete("/servers/:serverId", serverController.deleteServer);

module.exports = router;
