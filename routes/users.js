const router = require("express").Router();

const User = require("../models/User");
const verifyToken = require("../middlewares/ProtectedRoutes/verifyToken");


router.post("/list", verifyToken, async (req, res) => {
  try {
    console.log(req.body);
    const page = Number(req.body.page);
    const limit = Number(req.body.limit);
    const skip = (page - 1) * limit;
    const sort = req.body.sort;
    const search = req.body.search;
    const fieldToSearchData = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
    const queryDocument = {
      $and: [{ $or: fieldToSearchData }, { role: "Employee" }],
    };

    const users = await User.find(queryDocument).skip(skip).limit(limit);
    const totalRecords = await User.countDocuments(queryDocument);
    const pages = (totalRecords%limit === 0) ? Math.trunc(totalRecords/limit) : (Math.trunc(totalRecords/limit) + 1);
    if (users.length === 0) {
      res.status(404).json({
        status: false,
        message: "Employee List not found",
        employeeList: users,
        page,
        pages,
        pageRecords: users.length,
        totalRecords,
      });
    } else
      res.json({
        status: true,
        message: "Employee List found successfully",
        employeeList: users,
        page,
        pages,
        pageRecords: users.length,
        totalRecords,
      });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to fetch Employee List" });
  }
});

router.post("/:id", verifyToken, async (req,res) => {
  try{
    const users = await User.findOne({_id: req.params.id})
    if(users){
    res
    .status(201)
    .json({ status: true, message: "Employee found successfully!", user: users });
    }
    else{
      res
      .status(404)
      .json({ status: false, message: "Employee do not exits" });
    }
  }catch(err){
    res
    .status(400)
    .json({ status: false, message: "Unable to fetch Employee Data" });
  }
})

router.patch("/update/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
      const { firstName, lastName, email, password, role } = req.body;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (role) user.role = role;
      if (password) {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        user.password = hashPassword;
      }
      await user.save();
      res
        .status(201)
        .json({ status: true, message: "Employee Data updated successfully!" });
    } 
    else {
      // user do not exist
      res.status(404).json({ status: false, message: "Employee do not exists" });
    }
  } catch (err) {
    // user id may be incorrect or undefined
    res.status(400).json({
      status: false,
      message: "Unable to fetch Employee Data",
    });
  }
});

router.delete("/delete/:id", verifyToken, async (req,res) => {
  try {
      const result = await User.deleteOne({_id: req.params.id})
      console.log(result)
      res.status(201).json({
        status: true,
        message: "Employee deleted successfully!",
      });
  }catch(err) {
        // user id may be incorrect or undefined
        res.status(404).json({
          status: false,
          message: "Unable to fetch Employee Data",
        });
  }
})

module.exports = router;
