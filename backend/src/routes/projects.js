const router = require('express').Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getMembers,
} = require('../controllers/projectController');

router.get('/',                       auth,                     getAllProjects);
router.post('/',                      auth, roleCheck('admin'), createProject);
router.get('/:id',                    auth,                     getProjectById);
router.put('/:id',                    auth, roleCheck('admin'), updateProject);
router.delete('/:id',                 auth, roleCheck('admin'), deleteProject);
router.get('/:id/members',            auth,                     getMembers);
router.post('/:id/members',           auth, roleCheck('admin'), addMember);
router.delete('/:id/members/:userId', auth, roleCheck('admin'), removeMember);

module.exports = router;