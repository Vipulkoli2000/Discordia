const Channel = require("../Schema/channelSchema");
const Server = require("../Schema/serverSchema");

const channelController = {
  createChannel: async (req, res, next) => {
    try {
      console.log("sa");
      const { serverId } = req.params;
      const { channelName, channelType, category } = req.body;

      const newChannel = new Channel({
        server: serverId,
        channelName,
        channelType,
        category: category || null,
      });

      await newChannel.save();

      res
        .status(201)
        .json({ message: "Channel created successfully", channel: newChannel });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getServerChannels: async (req, res, next) => {
    try {
      const serverId = req.params.id;
      const channels = await Channel.find({ server: serverId }).populate(
        "threads"
      );
      res.json(channels);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getChannel: async (req, res, next) => {
    try {
      const channelId = req.params.channelId;
      console.log(channelId);
      const channel = await Channel.findById(channelId);
      res.json(channel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  joinThread: async (req, res, next) => {
    try {
      const { serverId, channelId } = req.params;
      const { channelName, channelType, category } = req.body;
      const newThread = new Channel({
        server: serverId,
        channelName,
        channelType,
        category: category || null,
      });
      const channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found." });
      }
      channel.threads.push(newThread._id);
      await channel.save();
      await newThread.save();
      res
        .status(201)
        .json({ message: "Thread created successfully", thread: newThread });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateChannel: async (req, res, next) => {
    try {
      const channelId = req.params.channelId;
      const { channelName, channelType } = req.body;

      const channel = await Channel.findByIdAndUpdate(
        channelId,
        { channelName, channelType },
        { new: true }
      );
      if (!channel) {
        return res.status(404).json({ message: "Channel not found." });
      }

      res.json({ message: "Channel updated successfully.", channel });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteChannel: async (req, res, next) => {
    try {
      const channelId = req.params.channelId;
      const deletedChannel = await Channel.findByIdAndDelete(channelId);
      if (!deletedChannel) {
        return res.status(404).json({ message: "Channel not found." });
      }

      res.json({ message: "Channel deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = channelController;
