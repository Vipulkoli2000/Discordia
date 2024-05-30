const cookie = require("cookie");

function parseJWTFromSocket(socket) {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const jwt = cookies.jwt;
    if (!jwt) throw new Error("JWT not found");

    const base64Url = jwt.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(Buffer.from(base64, "base64").toString());

    if (!decodedPayload.userId) throw new Error("Invalid JWT payload");

    return decodedPayload;
  } catch (error) {
    console.error("JWT Parsing Error:", error.message);
    return null;
  }
}

module.exports = { parseJWTFromSocket };
