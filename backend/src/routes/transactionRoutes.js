import express from 'express';
import {
  createTransaction,
  getTransactions,
  getFinancialSummary,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getTransactions)
  .post(protect, admin, createTransaction);

router.get('/summary', protect, admin, getFinancialSummary);

router.route('/:id')
  .get(protect, admin, getTransactionById)
  .put(protect, admin, updateTransaction)
  .delete(protect, admin, deleteTransaction);

export default router;
