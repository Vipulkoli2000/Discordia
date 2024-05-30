const Thread = require("../Schema/Threads");
const Channel = require("../Schema/channelSchema");
const Threadchat = require("../Schema/chatSchema");

const channelController = {
  createThread: async (req, res, next) => {
    try {
      console.log("sa");
      const { channelID } = req.params;
      const { title, content, creator } = req.body;

      const newThread = new Thread({
        title,
        creator: req.user._id,
        channelID,
      });

      if (!newThread) {
        return res.status(404).json({ message: "Thread not found." });
      }
      const newmessage = new Threadchat({
        ThreadId: newThread._id,
        user: req.user._id,
        content,
      });

      await newmessage.save();

      const channel = await Channel.findById(channelID);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found." });
      }

      channel.threads.push(newThread);
      await channel.save();
      await newThread.save();
      res
        .status(201)
        .json({ message: "Thread created successfully", Thread: newThread });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  Threadcreatechat: async (req, res, next) => {
    try {
      const { ThreadId } = req.params;
      const { content } = req.body;

      const newmessage = new Threadchat({
        ThreadId,
        user: req.user._id,
        content,
      });

      await newmessage.save();

      res
        .status(201)
        .json({ message: "Thread created successfully", Thread: newmessage });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getThreadchat: async (req, res, next) => {
    try {
      const threadId = req.params.threadId;
      const threadchat = await Threadchat.find({ ThreadId: threadId }).populate(
        "user"
      );
      res.json(threadchat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  joinThread: async (req, res, next) => {
    try {
      const threadId = req.params.threadId;
      const userId = req.user._id;
      const thread = await Thread.findById(threadId);
      if (!thread) {
        return res.status(404).json({ message: "Thread not found." });
      }
      thread.members.push(userId);
      await thread.save();
      res.json({ message: "User joined thread successfully.", thread });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  leaveThread: async (req, res, next) => {
    try {
      const threadId = req.params.threadId;
      const userId = req.user._id;
      const thread = await Thread.findById(threadId);
      if (!thread) {
        return res.status(404).json({ message: "Thread not found." });
      }
      thread.members = thread.members.filter((member) => member !== userId);
      await thread.save();
      res.json({ message: "User left thread successfully.", thread });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getThreads: async (req, res, next) => {
    try {
      const channelID = req.params.channelID;

      const threads = await Thread.find({ channelID }).populate("members");
      if (!threads) {
        return res.status(404).json({ message: "Thread not found." });
      }

      res.json({ threads });
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

module.exports = channelController;
