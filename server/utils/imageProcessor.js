const sharp = require('sharp');

/**
 * Compress an image using Sharp
 * @param {Buffer} buffer - The image buffer
 * @param {Object} options - Compression options
 * @returns {Promise<Buffer>} - Compressed image buffer
 */
const compressImage = async (buffer, options = {}) => {
  const {
    width = 1200,
    height = 1200,
    quality = 80,
    format = 'jpeg'
  } = options;

  try {
    // Process image with Sharp
    const processedImageBuffer = await sharp(buffer)
      .resize({
        width,
        height,
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat(format, { quality })
      .toBuffer();

    return processedImageBuffer;
  } catch (error) {
    console.error('Error compressing image:', error);
    return buffer; // Return original buffer if compression fails
  }
};

module.exports = { compressImage }; 