const User = require("../Schema/userSchema");

const permissions = {
  CREATE_MESSAGE: "create_message",
  DELETE_MESSAGE: "delete_message",
  MANAGE_CHANNEL: "manage_channel",
  MANAGE_SERVER: "manage_server",
  // Add more permissions as needed
};

exports.loadUserPermissions = async (req, res, next) => {
  try {
    // Example: Load user's roles and permissions from the database
    const userRoles = await Role.find({ user: req.user.id });
    const permissions = userRoles.reduce(
      (acc, role) => [...acc, ...role.permissions],
      []
    );

    req.userPermissions = permissions;
    next();
  } catch (error) {
    res.status(500).json({ message: "Failed to load user permissions." });
  }
};

exports.hasPermission = (requiredPermission) => {
  return function (req, res, next) {
    const { userPermissions } = req;

    if (!userPermissions || !userPermissions.includes(requiredPermission)) {
      return res.status(403).json({ message: "Insufficient permissions." });
    }

    next();
  };
};
