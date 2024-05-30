var express = require("express");
var router = express.Router();
const Categorycontroller = require("../controller/Categorycontroller");
const { isAuthenticated } = require("../Middlewares/Auth");
const {
  loadUserPermissions,
  hasPermission,
} = require("../Middlewares/Permissions");

router.get("/:id", Categorycontroller.getServerCategories);
router.get(
  "/getcategory/:serverId",
  Categorycontroller.getAllCategoriesWithChannels
);
router.post(
  "/create/:serverId",

  Categorycontroller.createcategory
);
router.put(
  "/:CategorieID",
  isAuthenticated,
  loadUserPermissions,
  hasPermission("MANAGE_CHANNEL"),
  Categorycontroller.updateCategorie
);
router.delete(
  ":CategorieID",
  isAuthenticated,
  loadUserPermissions,
  hasPermission("MANAGE_CHANNEL"),
  Categorycontroller.deleteCategorie
);

module.exports = router;
