const router = require("express").Router();
const { register } = require("../controllers/authController");
const { login } = require("../controllers/authController.js");
const { body, validationResult } = require("express-validator");
const { protect } = require("../middlewares/authMiddleware.js");
const { User } = require("../models");
const db = require("../models");
router
  .route("/login")
  .post(
    [
      body("email").notEmpty().withMessage("This field is required"),
      body("password").notEmpty().withMessage("This field is required"),
    ],
    login
  );

router.post(
  "/register",

  [
    body("name").notEmpty().withMessage("This field is required"),
    body("username").notEmpty().withMessage("This field is required"),
    body("email").isEmail().normalizeEmail().withMessage("Invalid Email"),
    body("phone").notEmpty().withMessage("This field is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password should be atleast 8 characters"),
  ],
  register
);

router
  .route("/profile/update")
  .put(
    [
      body("name").notEmpty().withMessage("This field is required"),
      body("phone").notEmpty().withMessage("This field is required"),
    ],
    protect,
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json(errors);
        }

        await User.update(
          { name: req.body.name, phoneNumber: req.body.phone },
          { where: { id: req.user.id } }
        );

        res.send("Profile updated");
      } catch (error) {
        next(error);
      }
    }
  );

// get all users

router.get("/users", async (req, res, next) => {
  try {
    const { page = 1, perPage = 8 } = req.query;

    const { rows: users, count } = await User.findAndCountAll({
      where: {
        role: "user",
      },
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * perPage,
      limit: perPage,
    });

    return res.json({ pageCount: Math.ceil(count / perPage), users });
  } catch (error) {
    next(error);
  }
});

router.put("/users/:userId/update", async (req, res, next) => {
  try {
    await User.update(req.body, {
      where: {
        id: req.params.userId,
      },
    });

    res.send("user updated");
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:userId/delete", async (req, res, next) => {
  try {
    await User.destroy({
      where: {
        id: req.params.userId,
      },
    });

    res.send("User removed");
  } catch (error) {
    next(error);
  }
});

router.get("/analytics", async (req, res, next) => {
  try {
    const userCount = await db.User.count({
      where: {
        role: "user",
      },
    });

    const activeUserCount = await db.User.count({
      where: {
        role: "user",
        active: true,
      },
    });

    const testimonialCount = await db.Testimonial.count();

    res.json({
      userCount,
      activeUserCount,
      testimonialCount,
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
