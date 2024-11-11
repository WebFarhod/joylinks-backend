const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

exports.updateMe = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      phone,
      biography,
      photo,
      region,
      birthdate,
      district,
      gender
    } = req.body;

    // Prepare fields to update
    const updateFields = {
      ...(firstname && { firstname }),
      ...(lastname && { lastname }),
      ...(birthdate && { birthdate }),
      ...(phone && { phone, region, district }),
      ...(biography && { biography }),
      ...(photo && { photo }),
      ...(gender && { gender })
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("role").select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const {
      phone,
      firstname,
      lastname,
      password,
      role,
      region,
      birthdate,
      district,
      photo,
    } = req.body;

    if (!phone || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    let userRole = await Role.findOne({ name: "user" }) || new Role({ name: "user" });
    if (userRole.isNew) await userRole.save();

    const user = new User({
      phone,
      firstname,
      lastname,
      password: password,
      role: role || userRole.id,
      region,
      birthdate,
      district,
      photo: req.file ? req.file.path : photo,
    });

    await user.save();
    const { password: _, ...userData } = user.toObject(); // Remove password from response

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const roleData = await Role.findById(role);
    if (!roleData) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone }).populate("role");
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role.name });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role.name });

    user.refreshToken = refreshToken;
    await user.save();

    const { password: _, refreshToken: __, ...userData } = user.toObject(); // Remove sensitive fields

    res.status(200).json({
      accessToken,
      refreshToken,
      user: userData,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(401).json({ error: "No token provided" });

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ error: "Invalid refresh token" });

    const userPayload = verifyRefreshToken(token);

    const newAccessToken = generateAccessToken({
      id: userPayload.id,
      role: userPayload.role,
    });
    const newRefreshToken = generateRefreshToken({
      id: userPayload.id,
      role: userPayload.role,
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

exports.logout = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ refreshToken: token });

    if (!user) return res.status(400).json({ error: "User not found" });

    user.refreshToken = null;
    await user.save();

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
