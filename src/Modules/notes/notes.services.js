import mongoose from "mongoose";
import { NotesModel } from "../../DB/index.js";

export const createNote = async (req, res) => {
  try {
    const { id: userId } = req.query;
    const { title, content } = req.body;

    await NotesModel.create({ title, content, userId });

    return res.status(201).json({ message: "Note created" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { id: userId } = req.query;
    const { title, content } = req.body;

    const note = await NotesModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }

    const updatedNote = await NotesModel.findByIdAndUpdate(
      noteId,
      { title, content },
      { new: true, runValidators: true },
    );

    return res.status(200).json(updatedNote);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const replaceNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { id: userId } = req.query;
    const { title, content } = req.body;

    const note = await NotesModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }

    const replacedNote = await NotesModel.findOneAndReplace(
      { _id: noteId },
      { title, content, userId },
      { new: true, runValidators: true },
    );

    return res.status(200).json(replacedNote);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const updateAllTitles = async (req, res) => {
  try {
    const { id: userId } = req.query;
    const { title } = req.body;

    const result = await NotesModel.updateMany(
      { userId },
      { title },
      { runValidators: true },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No note found" });
    }

    return res.status(200).json({ message: "All notes updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { id: userId } = req.query;

    const note = await NotesModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }

    const deletedNote = await NotesModel.findByIdAndDelete(noteId);

    return res.status(200).json(deletedNote);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getPaginatedNotes = async (req, res) => {
  try {
    const { id: userId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const notes = await NotesModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json(notes);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { id: userId } = req.query;

    const note = await NotesModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }

    return res.status(200).json(note);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getNoteByContent = async (req, res) => {
  try {
    const { id: userId, content } = req.query;

    const note = await NotesModel.findOne({ userId, content });
    if (!note) {
      return res.status(404).json({ message: "No note found" });
    }

    return res.status(200).json(note);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getNotesWithUser = async (req, res) => {
  try {
    const { id: userId } = req.query;

    const notes = await NotesModel.find({ userId })
      .select("title userId createdAt")
      .populate("userId", "email -_id");

      if(notes.length === 0) return res.status(404).json({ message: "No notes found" });

    return res.status(200).json({ notes });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getNotesAggregate = async (req, res) => {
  try {
    const { id: userId, title } = req.query;

    const notes = await NotesModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          title: { $regex: title || "", $options: "i" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          title: 1,
          userId: 1,
          createdAt: 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]);

    return res.status(200).json({ notes });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const deleteAllNotes = async (req, res) => {
  try {
    const { id: userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "id is required" });
    }

   const deletedNote = await NotesModel.deleteMany({ userId });

    return res.status(200).json({ message: "All Notes Deleted", deletedNote });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};