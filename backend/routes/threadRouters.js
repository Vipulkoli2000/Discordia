var express = require("express");
var router = express.Router();
const Threadcontroller = require("../controller/Threadcontroller");
const { isAuthenticated } = require("../Middlewares/Auth");

router.post("/:channelID", isAuthenticated, Threadcontroller.createThread);
router.get("/join/:threadId", Threadcontroller.joinThread);
router.get("/leave/:threadId", Threadcontroller.leaveThread);
router.get("/allthreads/:channelID", Threadcontroller.getThreads);
router.put("/update/:threadId", Threadcontroller.updateThreads);
router.delete("/delete/:threadId", Threadcontroller.deleteThread);
router.post("/chatcreate/:threadId", Threadcontroller.Threadcreatechat);
router.get("/chat/:threadId", Threadcontroller.getThreadchat);

module.exports = router;
