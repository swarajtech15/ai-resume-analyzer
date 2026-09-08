const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const createAnalyzeRouter = require("./routes/analyze");

const app = express();

const PORT = process.env.PORT || 5000;

const ADMIN_FILE = path.join(__dirname, "data", "admin.json");

const JWT_SECRET =
  process.env.JWT_SECRET || "ai-resume-analyzer-development-secret";

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

// =========================================================
// HELPERS
// =========================================================

function readAdmin() {
  if (!fs.existsSync(ADMIN_FILE)) {
    return { registered: false };
  }

  return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf8"));
}

function saveAdmin(admin) {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(admin, null, 2));
}

// =========================================================
// PASSWORD HASHING
// =========================================================

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return {
    salt,
    hash,
  };
}

function verifyPassword(password, salt, storedHash) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(storedHash, "hex"),
  );
}

// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Analyzer API is running",
  });
});

// =========================================================
// ADMIN STATUS
// =========================================================

app.get("/api/admin/status", (req, res) => {
  const admin = readAdmin();

  res.json({
    registered: admin.registered === true,
  });
});

// =========================================================
// REGISTER ADMIN
// =========================================================

app.post("/api/admin/register", (req, res) => {
  try {
    const { username, password, mobile } = req.body;

    if (!username || !password || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Username, password and mobile number are required.",
      });
    }

    const admin = readAdmin();

    if (admin.registered) {
      return res.status(409).json({
        success: false,
        message: "An admin account is already registered.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    const { salt, hash } = hashPassword(password);

    const newAdmin = {
      registered: true,
      username,
      mobile,
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString(),
    };

    saveAdmin(newAdmin);

    res.status(201).json({
      success: true,
      message: "Admin account created successfully.",
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create admin account.",
    });
  }
});

// =========================================================
// LOGIN
// =========================================================

app.post("/api/admin/login", (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = readAdmin();

    if (!admin.registered) {
      return res.status(404).json({
        success: false,
        message: "No admin account exists. Please register first.",
      });
    }

    if (username !== admin.username) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const validPassword = verifyPassword(
      password,
      admin.passwordSalt,
      admin.passwordHash,
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const token = jwt.sign(
      {
        username: admin.username,
        role: "admin",
      },
      JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    res.json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
});

// =========================================================
// AUTH MIDDLEWARE
// =========================================================

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    req.admin = decoded;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
}

app.use("/api", createAnalyzeRouter(authenticateAdmin));

// =========================================================
// PROTECTED ADMIN TEST ROUTE
// =========================================================

app.get("/api/admin/protected", authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    message: "You have access to the admin area.",
    admin: req.admin,
  });
});

// =========================================================
// CHANGE PASSWORD
// =========================================================

app.post("/api/admin/change-password", authenticateAdmin, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new passwords are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least 8 characters.",
      });
    }

    const admin = readAdmin();

    const validPassword = verifyPassword(
      currentPassword,
      admin.passwordSalt,
      admin.passwordHash,
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const { salt, hash } = hashPassword(newPassword);

    admin.passwordSalt = salt;
    admin.passwordHash = hash;

    saveAdmin(admin);

    res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to change password.",
    });
  }
});

// =========================================================
// START SERVER
// =========================================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║       AI RESUME ANALYZER BACKEND          ║
╠════════════════════════════════════════════╣
║ Server: http://localhost:${PORT}             ║
║ API:    http://localhost:${PORT}/api         ║
╚════════════════════════════════════════════╝
  `);
});
