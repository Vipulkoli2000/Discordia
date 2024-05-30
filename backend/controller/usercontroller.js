const User = require("../Schema/userSchema");
const Directmessage = require("../Schema/Directmessageschema");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/usertoken");
const UserConversation = require("../Schema/Userconversation");
const Directmesagesboth = require("../Schema/Directmesagesboth");

async function updateOrCreateConversation(senderId, receiverId, directmessage) {
  try {
    // Ensure senderId and receiverId are stored in a consistent order
    const userIds = [senderId, receiverId].sort();

    // Find an existing conversation between these two users

    let Schemadirectmessage = await Directmesagesboth.findOne({
      users: { $all: userIds },
    });
    if (Schemadirectmessage) {
      console.log("directmessage", directmessage._id);
      await Schemadirectmessage.Messages.push(directmessage._id);
      console.log("Directmessage updated :", Schemadirectmessage);
      await Schemadirectmessage.save();
    }
    if (!Schemadirectmessage) {
      Schemadirectmessage = new Directmesagesboth({
        users: userIds,
        lastMessageTimestamp: new Date(),
      });
      await Schemadirectmessage.Messages.push(directmessage._id);
      await Schemadirectmessage.save();
      console.log("Directmessage created:", Schemadirectmessage);
    }

    let conversation = await UserConversation.findOne({
      users: { $all: userIds },
    });

    if (conversation) {
      // If conversation exists, update the lastMessageTimestamp
      conversation.lastMessageTimestamp = new Date();
      await conversation.save();
      console.log("Conversation updated :", conversation);
    } else {
      // If no conversation exists, create a new one
      conversation = new UserConversation({
        users: userIds,
        lastMessageTimestamp: new Date(),
      });
      await conversation.save();
      console.log("Conversation created:", conversation);
    }
  } catch (error) {
    console.error("Error updating or creating conversation:", error);
  }
}
const Usercontroller = {
  sendMessage: async (data, user2) => {
    try {
      if (!data) {
        throw new Error("Data is null or undefined");
      }

      const { reciever, content } = data;

      const user1 = await User.findById(user2);

      const directmessage = await Directmessage.create({
        sender: user1,
        reciever,
        content,
      });

      updateOrCreateConversation(user1._id, reciever, directmessage);

      return directmessage;
    } catch (error) {
      throw error;
    }
  },
  Register: async (req, res, next) => {
    try {
      console.log("work");
      const { username, email, password } = req.body;
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = await User.create({ username, email, passwordHash });
      const token = generateToken(user);

      res.cookie("jwt", token, { httpOnly: true, SameSite: "none" });

      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  Login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "Invalid Email or password" });
      }
      const validPassword = await bcrypt.compare(password, user.passwordHash);

      if (!validPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = generateToken(user);

      res.cookie("jwt", token, { httpOnly: true, sameSite: "Lax" }); // For local testing

      return res.json({ user, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  Addfriend: async (req, res, next) => {
    try {
      const { userid, friendid } = req.body;
      const user = await User.findById(userid);
      const friend = await User.findById(friendid);
      if (!user || !friend) {
        return res.status(401).json({ error: "Invalid User or friend" });
      }
      user.friends.push(friend);
      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  Removefriend: async (req, res, next) => {
    try {
      const { userid, friendid } = req.body;
      const user = await User.findById(userid);
      const friend = await User.findById(friendid);
      if (!user || !friend) {
        return res.status(401).json({ error: "Invalid User or friend" });
      }
      user.friends.pull(friend);
      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Getuser: async (req, res, next) => {
    try {
      const userid = req.user._id;
      const user = await User.findById(userid);
      if (!user) {
        return res.status(401).json({ error: "Invalid User" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  Getuserbyid: async (req, res, next) => {
    try {
      const userid = req.params.userId;
      const user = await User.findById(userid);
      if (!user) {
        return res.status(401).json({ error: "Invalid User" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  GetuserMessage: async (req, res, next) => {
    try {
      const { receiverId } = req.params; // Assuming this is the ID of the other user in the conversation
      const userId = req.user._id; // The logged-in user's ID
      console.log("userId", userId, "receiverId", receiverId);
      const conversations = await Directmesagesboth.findOne({
        users: { $all: [userId, receiverId] },
      }).populate({
        path: "Messages",
        populate: {
          path: "sender",
        },
      });
      if (!conversations) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      console.log("PAPPAPA", conversations);
      // Check if messages exist
      if (!conversations) {
        return res
          .status(404)
          .json({ error: "No messages found between these users." });
      }

      // Return the sorted messages
      res.json(conversations.Messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: error.message });
    }
  },
  getallusers: async (req, res, next) => {
    try {
      const users = await User.find();
      console.log(users);
      if (!users) {
        return res.status(401).json({ error: "Invalid User" });
      }

      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAlldirectmessage: async (req, res, next) => {
    try {
      const conversations = await UserConversation.find({
        users: { $in: [req.user._id] },
      }).populate({
        path: "users",
        model: "User",
        select: "username",
      });
      if (!conversations) {
        return res.status(401).json({ error: "Invalid User" });
      }

      // Map conversations to include only the other user
      const modifiedConversations = conversations.map((conversation) => {
        // Filter out the current user, leaving only the other user
        const otherUsers = conversation.users.filter(
          (user) => user._id.toString() !== req.user._id.toString()
        );

        // Assuming conversations are between 2 users, take the first user found
        const otherUser = otherUsers[0] || null;

        return {
          ...conversation._doc, // Spread the original conversation document
          users: otherUser ? [otherUser] : [], // Replace users with only the other user
        };
      });

      console.log("convear", modifiedConversations);
      res.json(modifiedConversations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteDirectmessagetab: async (req, res, next) => {
    try {
      console.log("ASdasd");
      const { userid } = req.body;
      const user = req.user._id.toString(); // Ensure this is a string for comparison
      console.log("AUTH", userid, user);
      const conversation = await UserConversation.findOneAndDelete({
        users: { $all: [userid, user] },
      });
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      res.json({ conversation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },
  Getdirectmessages: async (req, res, next) => {
    console.log("ASD213");
    try {
      const userid = req.user._id.toString(); // Ensure this is a string for comparison
      console.log("AUTH", userid);

      const users = await UserConversation.findOne({
        users: { $all: [userid] },
      });

      console.log("users", users);

      // Check for no users found
      if (!users) {
        return res.status(401).json({ error: "Invalid User" });
      }

      let otherUserId = users.users.find((id) => id.toString() !== userid); // Find the other user's ID
      if (!otherUserId) {
        return res.status(404).json({ error: "Other user not found" });
      }

      let user = await User.findById(otherUserId); // Fetch the other user's data
      console.log("user", user);

      res.json([user]);
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: error.message });
    }
  },

  SendDirectmessages: async (req, res, next) => {
    try {
      const { senderid, recieverid, content } = req.body;
      const sender = await User.findById(senderid);
      const reciever = await User.findById(recieverid);
      if (!sender || !reciever) {
        return res.status(401).json({ error: "Invalid User" });
      }
      const directmessage = await Directmessage.create({
        sender,
        reciever,
        content,
      });
      res.json(directmessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = Usercontroller;
