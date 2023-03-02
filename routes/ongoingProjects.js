const router = require("express").Router();
const verifyToken = require("../middlewares/ProtectedRoutes/verifyToken");
const Projects = require("../models/Project")
router.post("/list", verifyToken, async (req, res) => {
  try {
      console.log(req.body);
      const page = Number(req.body.page);
      const limit = Number(req.body.limit);
      const skip = (page - 1) * limit;
      const projects = await Projects.find({status:"ongoing"}).skip(skip).limit(limit);
      const totalRecords = await Projects.countDocuments({status:"ongoing"});
      const pages = (totalRecords % limit === 0) ? Math.trunc(totalRecords / limit) : (Math.trunc(totalRecords / limit) + 1);
      if (projects.length === 0) {
          res.status(200).json({
              status: true,
              message: "Projects List not found",
              ProjectList: projects,
              page,
              pages,
              pageRecords: projects.length,
              totalRecords,
          });
      } else
          res.json({
              status: true,
              message: "Projects List found successfully",
              ProjectList: projects,
              page,
              pages,
              pageRecords: projects.length,
              totalRecords,
          });
  } catch (error) {
      console.log(error);
      res
          .status(400)
          .json({ status: false, message: "Unable to fetch Tasks List" });
  }
});

router.post("/add", verifyToken, async (req, res) => {
  console.log(req.body);
  let newTask 
  try {
          // if(task_id){
          //     const tt = await Projects.updateOne({_id:task_id},
          //      { $set: req.body
          //      } )
          // }else{
           newTask = new Projects(req.body)
          const savedUser = await newTask.save();
      // }
          // console.log(user);
          res.status(201).json({
              status: true,
              message: "Project Added Successfully!!",
          });
  } catch (error) {
      console.log(error);
      res.status(400).json({
          status: false,
          message: "Unable to add Project",
      });
  }
});

module.exports = router;
