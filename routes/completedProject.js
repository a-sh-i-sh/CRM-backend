const router = require("express").Router();
const User = require("../models/User")
const Projects = require("../models/Project");
const verifyToken = require("../middlewares/ProtectedRoutes/verifyToken");

router.post("/list", verifyToken, async (req, res) => {
    try {
        console.log(req.body);
        const page = Number(req.body.page);
        const limit = Number(req.body.limit);
        const skip = (page - 1) * limit;
        const projects = await Projects.find({status:"completed"}).skip(skip).limit(limit);
        const totalRecords = await Projects.countDocuments({status:"completed"});
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
router.post("/status", verifyToken, async (req, res) => {
    console.log(req.body);
    try {
                const tt = await Projects.updateOne({_id:req.body.project_id},
                 { $set: {
                    status: req.body.status,
                 }
                 } )
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

// router.post("/delete", verifyToken, async (req, res) => {
//     try {
//         const {id} = req.body;
//         console.log(id);
//          const result = await Tasks.deleteOne({_id: id})
//          console.log(result);
//          if(result.deletedCount !== 0){
//          res.status(201).json({
//            status: true,
//            message: "Task deleted successfully!",
//          });
//        }else {
//          res.status(404).json({
//            status: false,
//            message: "Task do not exits",
//          });
//        }
//      }catch(err) {
//            // user id may be incorrect or undefined
//            res.status(404).json({
//              status: false,
//              message: "Unable to fetch Task Data",
//            });
//      }
// });
router.post("/view", verifyToken, async (req, res) => {
    try {
        const { project_id } = req.body;
        const project = await Projects.findOne({ _id: project_id });
        if (project) {
            res.status(201).json({
                status: true,
                project: project,
                message: "Project found successfully!",
            });
        } else {
            res.status(404).json({
                status: false,
                message: "Project do not exits",
            });
        }
    } catch (err) {
        // user id may be incorrect or undefined
        console.log(err);
        res.status(404).json({
            status: false,
            message: "Unable to fetch Project",
        });
    }
});

module.exports = router;
