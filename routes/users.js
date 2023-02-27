const router = require("express").Router();

const User = require("../models/User");
const verifyToken = require("../middlewares/ProtectedRoutes/verifyToken");

router.post("/", verifyToken, async (req,res) => {
  try{
    const {id} = req.body;
    const users = await User.findOne({_id: id})
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

router.post("/list", verifyToken, async (req, res) => {
  try {
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

router.post("/delete", verifyToken, async (req,res) => {
  try {
     const {id} = req.body;
      const result = await User.deleteOne({_id: id[0]})
      if(result.deletedCount !== 0){
      res.status(201).json({
        status: true,
        message: "Employee deleted successfully!",
      });
    }else {
      res.status(404).json({
        status: false,
        message: "Employee do not exits",
      });
    }
  }catch(err) {
        // user id may be incorrect or undefined
        res.status(404).json({
          status: false,
          message: "Unable to fetch Employee Data",
        });
  }
})

module.exports = router;
