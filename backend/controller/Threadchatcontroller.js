const Thread = require("../Schema/Threads");
const Channel = require("../Schema/channelSchema");
const Threadchat = require("../Schema/chatSchema");
const User = require("../Schema/userSchema");

const Threadchatcontroller = {
  sendMessage: async (data, user) => {
    try {
      if (!data) {
        throw new Error("Data is null or undefined");
      }
      console.log(data);
      const { threadId, content, attachments } = data;
      console.log(data.threadId);
      const user1 = await User.findById(user);
      const ExisitingThread = await Thread.findById(threadId);

      if (!ExisitingThread) {
        throw new Error(`Thread not found for id: ${threadId}`);
      }

      const chat = await Threadchat.create({
        user: user1,
        content,
        attachments,
        ThreadId: threadId, // Associate the chat with the channel
      });

      return chat;
    } catch (error) {
      throw error;
    }
  },
  getThreadmessages: async (req, res, next) => {
    try {
      const ThreadId = req.params.ThreadId;

      // Fetch messages for the specified channel
      const messages = await Chat.find({ threadId: ThreadId }).populate(
        "user",
        "username"
      );

      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateThreads: async (req, res, next) => {
    try {
      const threadId = req.params.threadId;
      const { threadName } = req.body;

      const Thread = await Thread.findByIdAndUpdate(
        threadId,
        { title, threadName },
        { new: true }
      );
      if (!Thread) {
        return res.status(404).json({ message: "Channel not found." });
      }

      res.json({ message: "Channel updated successfully.", Thread });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteThread: async (req, res, next) => {
    try {
      const threadId = req.params.threadId;
      const deletedChannel = await Thread.findByIdAndDelete(threadId);
      if (!deletedChannel) {
        return res.status(404).json({ message: "Thread not found." });
      }

      res.json({ message: "Thread deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = Threadchatcontroller;
