const router = require("express").Router();

const User = require("../models/User");
const verifyToken = require("../middlewares/ProtectedRoutes/verifyToken");

router.post("/", verifyToken, async (req, res) => {
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
    if (users.length === 0) {
      res
        .status(404)
        .json({
          status: false,
          message: "Employee List not found",
          employeeList: users,
          page,
          pageRecords: users.length,
          totalRecords,
        });
    } else
      res.json({
        status: true,
        message: "Employee List found successfully",
        employeeList: users,
        page,
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

router.patch("/updateuser/:id", verifyToken, async (req, res) => {
  try{
  const user = await User.findOne({_id: req.params.id});
  if(user){

  }else{
    // unable to get user through this id
    console.log("ram")
  }
}catch(err){
// user id may be incorrect or undefined
}
});

module.exports = router;
