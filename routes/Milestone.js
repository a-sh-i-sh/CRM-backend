const router = require("express").Router();

const Milestone = require("../models/Milestone");
const verifyToken = require("../middlewares/ProtectedRoutes/verifyToken");
router.post("/list", verifyToken, async (req, res) => {
  try {
      console.log(req.body);
      const page = Number(req.body.page);
      const limit = Number(req.body.limit);
      const skip = (page - 1) * limit;
      const milestone = await Milestone.find({projectId:req.body.project_id}).skip(skip).limit(limit);
      const totalRecords = await Milestone.countDocuments({projectId:req.body.project_id});
      const pages = (totalRecords % limit === 0) ? Math.trunc(totalRecords / limit) : (Math.trunc(totalRecords / limit) + 1);
      if (milestone.length === 0) {
          res.status(200).json({
              status: true,
              message: "Milestone List not found",
              MilestoneList: milestone,
              page,
              pages,
              pageRecords: milestone.length,
              totalRecords,
          });
      } else
          res.json({
              status: true,
              message: "Milestone List found successfully",
              MilestoneList: milestone,
              page,
              pages,
              pageRecords: milestone.length,
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
  let newMilestone 
  try {
          // if(task_id){
          //     const tt = await Projects.updateOne({_id:task_id},
          //      { $set: req.body
          //      } )
          // }else{
            newMilestone = new Milestone(req.body)
          const savedUser = await newMilestone.save();
      // }
          // console.log(user);
          res.status(201).json({
              status: true,
              message: "Milestone Added Successfully!!",
          });
  } catch (error) {
      console.log(error);
      res.status(400).json({
          status: false,
          message: "Unable to add Milestone",
      });
  }
});


module.exports = router;
