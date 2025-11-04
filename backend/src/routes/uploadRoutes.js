import express from 'express';
import { uploadImage, uploadMultipleImages } from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../config/upload.js';

const router = express.Router();

// Ruta para subir imagen de perfil (cualquier usuario autenticado)
router.post('/profile', protect, upload.single('image'), uploadImage);

// Ruta para subir una sola imagen (solo admin)
router.post('/', protect, admin, upload.single('image'), uploadImage);

// Ruta para subir múltiples imágenes (máximo 5, solo admin)
router.post('/multiple', protect, admin, upload.array('images', 5), uploadMultipleImages);

export default router;
