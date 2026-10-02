import {UserModel} from "../../DB/index.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;

    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    await UserModel.create({ name, email, password, phone, age });

    return res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, age } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await UserModel.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    await UserModel.findByIdAndUpdate(id, { name, email, phone, age });

    return res.status(200).json({ message: "User updated" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const {id}= req.query;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};