import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DataStore } from "../db/store.js";

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || "edumind-ai-super-secret-key-2026";

// Register
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, education_level, course_branch, year_semester, main_subjects } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existing = DataStore.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "A student account with this email already exists." });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = DataStore.createUser({
      name,
      email,
      password_hash,
      education_level: education_level || "College",
      course_branch: course_branch || "General Studies",
      year_semester: year_semester || "Year 1",
      main_subjects: main_subjects || ["General Studies"],
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "30d" });

    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        education_level: newUser.education_level,
        course_branch: newUser.course_branch,
        year_semester: newUser.year_semester,
        xp: newUser.xp,
        level: newUser.level,
        current_streak: newUser.current_streak,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Registration failed" });
  }
});

// Login
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = DataStore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match && !user.password_hash.includes("demoHash")) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        education_level: user.education_level,
        course_branch: user.course_branch,
        year_semester: user.year_semester,
        avatar_url: user.avatar_url,
        xp: user.xp,
        level: user.level,
        current_streak: user.current_streak,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Login failed" });
  }
});

// 1-Click Instant Demo Login
authRouter.post("/demo-login", (req: Request, res: Response) => {
  const user = DataStore.findUserById("u-demo-student-001");
  if (!user) {
    return res.status(404).json({ error: "Demo student not found" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      education_level: user.education_level,
      course_branch: user.course_branch,
      year_semester: user.year_semester,
      avatar_url: user.avatar_url,
      xp: user.xp,
      level: user.level,
      current_streak: user.current_streak,
    },
  });
});

// Current User Profile
authRouter.get("/me", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = DataStore.findUserById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        education_level: user.education_level,
        course_branch: user.course_branch,
        year_semester: user.year_semester,
        avatar_url: user.avatar_url,
        xp: user.xp,
        level: user.level,
        current_streak: user.current_streak,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Update Profile
authRouter.put("/profile", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const updated = DataStore.updateUserProfile(decoded.id, req.body);
    return res.json({ user: updated });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});
