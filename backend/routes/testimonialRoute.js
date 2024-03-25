const router = require("express").Router();

const { validationResult, body } = require("express-validator");
const { protect } = require("../middlewares/authMiddleware");
const db = require("../models");
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, perPage = 10 } = req.query;

    console.log(page);

    if (page === "all") {
      const testimonials = await db.Testimonial.findAll({
        attributes: ["rating", "name", "description"],
        where:{
            verified:true
            }
      });

      return res.json(testimonials);
    }

    const options = {
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * perPage,
      limit: perPage
    };

    const { rows: testimonials, count } = await db.Testimonial.findAndCountAll(
      options
    );

    return res.json({ pageCount: Math.ceil(count / perPage), testimonials });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/add",
  protect,
  [
    body("name").notEmpty().withMessage("This field is required"),
    body("description").notEmpty().withMessage("This field is required"),
  ],

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json(errors);
      }

      await db.Testimonial.create({
        ...req.body,
        user_id: req.user.id,
      });

      res.send("Testimonial Submitted");
    } catch (error) {
      next(error);
    }
  }
);

router.put("/:id/update", async (req, res, next) => {
  try {
    console.log(req.body);
    await db.Testimonial.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    console.log(req.params);

    res.send("Testimonial Updated");
  } catch (error) {
    next(error);
  }
});

router.delete("/:id/delete", async (req, res, next) => {
  try {
    await db.Testimonial.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send("Testimonial removed");
  } catch (error) {
    next(error);
  }
});
module.exports = router;
