import Task from '../models/Task.js';

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task({
      title,
      description,
      user: userId
    });

    await task.save();
    return res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

// Get all tasks for authenticated user
export const getTasks = async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({
      message: 'Tasks retrieved successfully',
      tasks
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve tasks', error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user owns the task
    if (task.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own tasks' });
    }

    await Task.findByIdAndDelete(id);
    return res.status(200).json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};