const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require("../utils/cloudinary");

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (filePath) => cloudinaryUploadImg(filePath, "images");
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path: filePath } = file;
      try {
        const newpath = await uploader(filePath);
        console.log(newpath);
        urls.push(newpath);
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to upload or delete file at ${filePath}: ${err.message}`);
        // Attempt to delete the file locally if Cloudinary upload fails
        try {
          fs.unlinkSync(filePath);
        } catch (deleteErr) {
          console.error(`Failed to delete file at ${filePath}: ${deleteErr.message}`);
        }
      }
    }

    const images = urls.map((file) => file);
    res.json(images);
  } catch (error) {
    console.error(`Error in uploadImages: ${error.message}`);
    res.status(500).json({ message: "Failed to upload images" });
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error(`Error in deleteImages: ${error.message}`);
    res.status(500).json({ message: "Failed to delete image" });
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};
