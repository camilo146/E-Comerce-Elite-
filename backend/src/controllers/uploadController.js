// @desc    Subir imagen de producto
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha enviado ningún archivo' });
    }

    // Construir la URL de la imagen
    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      message: 'Imagen subida exitosamente',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Subir múltiples imágenes
// @route   POST /api/upload/multiple
// @access  Private/Admin
export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No se han enviado archivos' });
    }

    // Construir las URLs de las imágenes
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    res.status(200).json({
      message: `${req.files.length} imágenes subidas exitosamente`,
      imageUrls: imageUrls
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
