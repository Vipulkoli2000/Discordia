var express = require("express");
var router = express.Router();
const Usercontroller = require("../controller/usercontroller");
const { isAuthenticated } = require("../Middlewares/Auth");
/* GET users listing. */

router.get("/users/getusers", Usercontroller.getallusers);
router.get("/:receiverId", isAuthenticated, Usercontroller.GetuserMessage);
router.post("/user/register", Usercontroller.Register);
router.get("/specificuser/get", isAuthenticated, Usercontroller.Getuser);
router.get("/specificuser/oneuser/:userId", Usercontroller.Getuserbyid);
router.post("/user/login", Usercontroller.Login);
router.get(
  "/messages/getdirectmessage",
  isAuthenticated,
  Usercontroller.getAlldirectmessage
);
router.post("/create/sendmessage", Usercontroller.SendDirectmessages);
router.post(
  "/deleteuser/delete",
  isAuthenticated,
  Usercontroller.deleteDirectmessagetab
);
module.exports = router;
