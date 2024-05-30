// Importing necessary schemas

const Categories = require("../Schema/catagoriesSchema");
const Channel = require("../Schema/channelSchema");

// Controller object for handling channel-related operations
const channelController = {
  // Method for creating a new category
  createcategory: async (req, res, next) => {
    try {
      const { serverId } = req.params;
      const { categoryName } = req.body;

      // Creating a new category instance

      const newCategory = new Categories({
        server: serverId,
        categoryName,
      });

      // Saving the new category to the database
      await newCategory.save();
      // Sending success response with the created category

      res.status(201).json({
        message: "Category created successfully",
        Category: newCategory,
      });
    } catch (error) {
      // Handling errors

      res.status(500).json({ error: error.message });
    }
  },
  getAllCategoriesWithChannels: async (req, res) => {
    try {
      const { serverId } = req.params;
      const categories = await Categories.find({ server: serverId }).lean();

      // Fetch all channels
      const channels = await Channel.find({ server: serverId }).populate(
        "threads"
      );
      // Map channels to their categories
      const categoriesWithChannels = categories.map((category) => {
        // Filter channels that belong to the current category
        const filteredChannels = channels.filter(
          (channel) =>
            channel.category &&
            channel.category.toString() === category._id.toString()
        );
        console.log(filteredChannels);
        return { ...category, channels: filteredChannels };
      });

      // Filter channels that do not belong to any category
      const channelsWithoutCategory = channels.filter(
        (channel) => !channel.category
      );

      res.json({
        categories: categoriesWithChannels,
        channelsWithoutCategory,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getServerCategories: async (req, res, next) => {
    try {
      const serverId = req.params.id;
      const Categorie = await Categories.find({ server: serverId });
      res.json(Categorie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateCategorie: async (req, res, next) => {
    try {
      const CategorieID = req.params.CategorieID;
      const { categoryName } = req.body;

      const Categorie = await Categories.findByIdAndUpdate(
        CategorieID,
        { categoryName },
        { new: true }
      );
      if (!Categorie) {
        return res.status(404).json({ message: "Categorie not found." });
      }

      res.json({ message: "Categorie updated successfully.", Categorie });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteCategorie: async (req, res, next) => {
    try {
      const CategorieID = req.params.CategorieID;
      const deletedCategorie = await Channel.findByIdAndDelete(CategorieID);
      if (!deletedCategorie) {
        return res.status(404).json({ message: "Categorie not found." });
      }

      res.json({ message: "Categorie deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = channelController;
