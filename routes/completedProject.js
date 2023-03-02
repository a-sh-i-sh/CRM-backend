const router = require("express").Router();
const User = require("../models/User")
const CompletedProject = require("../models/completedProject");
const verifyToken = require("../middlewares/ProtectedRoutes/verifyToken");

router.post("/list", verifyToken, async (req, res) => {
    try {
        console.log(req.body);
        const page = Number(req.body.page);
        const limit = Number(req.body.limit);
        const skip = (page - 1) * limit;
        const tasks = await CompletedProject.find({}).skip(skip).limit(limit);
        const totalRecords = await CompletedProject.countDocuments({});
        const pages = (totalRecords % limit === 0) ? Math.trunc(totalRecords / limit) : (Math.trunc(totalRecords / limit) + 1);
        if (tasks.length === 0) {
            res.status(200).json({
                status: true,
                message: "Projects List not found",
                ProjectList: tasks,
                page,
                pages,
                pageRecords: tasks.length,
                totalRecords,
            });
        } else
            res.json({
                status: true,
                message: "Projects List found successfully",
                ProjectList: tasks,
                page,
                pages,
                pageRecords: tasks.length,
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
            if(task_id){
                const tt = await CompletedProject.updateOne({_id:task_id},
                 { $set: req.body
                 } )
            }else{
             newTask = new CompletedProject(req.body)
            const savedUser = await newTask.save();
        }
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
// router.post("/getTask", verifyToken, async (req, res) => {
//     try {
//         const { id } = req.body;
//         const task = await Tasks.findOne({ _id: id });
//         if (task) {
//             res.status(201).json({
//                 status: true,
//                 task: task,
//                 message: "Task deleted successfully!",
//             });
//         } else {
//             res.status(404).json({
//                 status: false,
//                 message: "Task do not exits",
//             });
//         }
//     } catch (err) {
//         // user id may be incorrect or undefined
//         console.log(err);
//         res.status(404).json({
//             status: false,
//             message: "Unable to fetch Task",
//         });
//     }
// });

module.exports = router;
