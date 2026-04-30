const Task = require('../models/Task');
const Project = require('../models/Project');

const getAllTasks = async (req, res) => {
  const { projectId, status, assigneeId } = req.query;

  try {
    // Find all projects the user belongs to
    const userProjects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    }).select('_id');

    const projectIds = userProjects.map((p) => p._id);

    const filter = { project: { $in: projectIds } };
    if (projectId)  filter.project  = projectId;
    if (status)     filter.status   = status;
    if (assigneeId) filter.assignee = assigneeId;

    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .populate('assignee', 'name email')
      .populate('createdBy', 'name')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignee', 'name email')
      .populate('createdBy', 'name');

    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, project, assignee } = req.body;

  if (!title || !project)
    return res.status(400).json({ error: 'Title and project are required' });

  try {
    const task = await Task.create({
      title, description, status, priority,
      dueDate: dueDate || null,
      project, assignee: assignee || null,
      createdBy: req.user.id,
    });

    await task.populate([
      { path: 'project', select: 'name' },
      { path: 'assignee', select: 'name email' },
    ]);

    res.status(201).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate, assignee } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate, assignee },
      { new: true, runValidators: true }
    )
      .populate('project', 'name')
      .populate('assignee', 'name email');

    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ['todo', 'in_progress', 'done'];

  if (!allowed.includes(status))
    return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('project', 'name').populate('assignee', 'name email');

    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const userProjects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    }).select('_id');

    const projectIds = userProjects.map((p) => p._id);

    const stats = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: null,
          todo:        { $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] } },
          in_progress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          done:        { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
          overdue: {
            $sum: {
              $cond: [
                { $and: [
                  { $lt: ['$dueDate', new Date()] },
                  { $ne: ['$status', 'done'] },
                  { $ne: ['$dueDate', null] },
                ]},
                1, 0,
              ],
            },
          },
        },
      },
      { $project: { _id: 0 } },
    ]);

    res.json(stats[0] || { todo: 0, in_progress: 0, done: 0, overdue: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getDashboardStats,
};