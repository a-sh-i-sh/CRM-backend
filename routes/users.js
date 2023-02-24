const router = require("express").Router();

const User = require("../models/User");
const verifyToken = require("../middlewares/ProtectedRoutes/verifyToken");

router.post("/", verifyToken, async (req, res) => {
  try {
    let page = req.page;
    console.log("page",Number(req.page))
    let limit = Number(req.limit);
    let skip = (page - 1) * limit;

    let users = await User.find({ role: "Employee" }, { password: 0 }).skip(skip).limit(limit);
    res.json({ Employee_List: users, Total_Records: users.length });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
