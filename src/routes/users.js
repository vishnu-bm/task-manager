const express = require("express");
const NewUser = require("../models/users.js");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("please upload image file"));
    }
    cb(undefined, true);
  },
});

router.post("/users", async (req, res) => {
  const user = new NewUser(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const users = await NewUser.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await users.generateAuthToken();
    res.send({ users, token });
  } catch (e) {
    res.status(400).send({});
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status.send(e);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const updatesList = ["name", "age", "email", "password"];
  const isAvailable = updates.every((update) => updatesList.includes(update));
  if (!isAvailable) {
    return res
      .status(400)
      .send({ msg: `${Object.keys(req.body)} field not availble` });
  }
  try {
    // const users = await NewUser.findById(req.user._id)

    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await NewUser.findById({ _id });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.post(
  "/user/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send(error.message);
  }
);

router.delete("/user/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/user/avatar", auth, async (req, res) => {
  try {
    if (!req.user.avatar) {
      throw new Error("avatar not found");
    }
    res.set("Content-Type", "image/png");
    res.send(req.user.avatar);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
