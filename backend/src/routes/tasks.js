const router = require('express').Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getDashboardStats,
} = require('../controllers/taskController');

router.get('/stats/dashboard', auth,                     getDashboardStats);
router.get('/',                auth,                     getAllTasks);
router.post('/',               auth, roleCheck('admin'), createTask);
router.get('/:id',             auth,                     getTaskById);
router.put('/:id',             auth, roleCheck('admin'), updateTask);
router.patch('/:id/status',    auth,                     updateTaskStatus);
router.delete('/:id',          auth, roleCheck('admin'), deleteTask);

module.exports = router;