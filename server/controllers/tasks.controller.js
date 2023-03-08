const Task = require("../models/tasks.model");
const LIMIT = 3;
const DEFAULT_SORT_ORDER = "asc";
const DEFAULT_SORT_BY = "userName";

const getTasks = async (req, res) => {
  const { page, sortBy, sortOrder } = req.query;

  try {
    const query = {
      limit: LIMIT,
      order: sortBy
        ? [
            [sortBy, sortOrder || DEFAULT_SORT_ORDER],
            ["id", DEFAULT_SORT_ORDER],
          ]
        : [
            [DEFAULT_SORT_BY, DEFAULT_SORT_ORDER],
            ["id", DEFAULT_SORT_ORDER],
          ],
      offset: (+page || 0) * LIMIT,
    };

    const tasks = await Task.findAndCountAll(query);
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
};

const createTask = async (req, res) => {
  const { userName, email, text, done } = req.body;

  try {
    if (
      userName &&
      userName.trim() &&
      email &&
      email.trim() &&
      text &&
      text.trim()
    ) {
      const task = await Task.create({
        userName: userName.trim(),
        email: email.trim(),
        text: text.trim(),
        done: !!done,
        textIsEdited: false,
      });

      res.status(200).send({ id: task.id });
    } else {
      res.status(422).send("userName, email and text are required");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateTask = async (req, res) => {
  const { id, userName, email, text, done } = req.body;

  if (!id) {
    res.status(422).send("id is required");
  }

  try {
    const task = await Task.findOne({
      raw: true,
      where: {
        id,
      },
    });

    if (!task) {
      res.status(404).send("Task with this id is not found");
    }

    const query = {};

    if (done !== undefined) {
      query.done = done;
    }

    if (userName && userName.trim()) {
      query.userName = userName.trim();
    }

    if (email && email.trim()) {
      query.email = email.trim();
    }

    if (text && text.trim()) {
      query.text = text.trim();

      if (task.text !== text.trim()) {
        query.textIsEdited = true;
      }
    }

    await Task.update(query, {
      where: {
        id,
      },
    });

    res.status(200).send({ id });
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteTask = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(422).send(`${id} is not valid id`);
  }

  try {
    const result = await Task.destroy({
      where: {
        id,
      },
    });
    res.status(200).send("Task was deleted");
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
