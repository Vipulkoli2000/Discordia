const Chat = require("../Schema/chatSchema");
const Channel = require("../Schema/channelSchema");
const User = require("../Schema/userSchema");

const chatController = {
  sendMessage: async (data, user2) => {
    try {
      if (!data) {
        throw new Error("Data is null or undefined");
      }
      const { channel, content, attachments } = data;

      const user1 = await User.findById(user2);

      const chat = await Chat.create({
        user: user1,
        content,
        attachments,
        channel, // Associate the chat with the channel
      });

      // Add chat reference to the channel
      const Channels = await Channel.findById(channel);
      if (!Channels) {
        throw new Error(`Channel not found for id: ${channel}`);
      }

      return chat;
    } catch (error) {
      throw error;
    }
  },

  createMessage: async (req, res, next) => {
    try {
      const { content } = req.body;
      const newMessage = new Chat({
        channel: req.params.channelId,
        user: req.user._id, // Assuming req.user is populated by the authentication middleware
        content,
      });
      await newMessage.save();

      res.status(201).json({
        message: "Message created successfully!",
        messageId: newMessage._id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getChannelMessages: async (req, res, next) => {
    try {
      const channelId = req.params.channelId;

      // Fetch messages for the specified channel
      const messages = await Chat.find({ channel: channelId }).populate(
        "user",
        "username"
      );

      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateMessage: async (req, res, next) => {
    try {
      const { messageId } = req.params;
      const { content } = req.body;

      const message = await Message.findById(messageId);

      if (!message) {
        return res.status(404).json({ message: "Message not found." });
      }

      if (message.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "User is not authorized to update this message." });
      }

      message.content = content;
      await message.save();

      res.json({
        message: "Message updated successfully.",
        updatedMessage: message,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = chatController;
