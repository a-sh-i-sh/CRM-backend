const router = require("express").Router();
const User = require("../models/User")
const Tasks = require("../models/tasks");
const verifyToken = require("../middlewares/ProtectedRoutes/verifyToken");

router.post("/list", verifyToken, async (req, res) => {
    try {
        console.log(req.body);
        const page = Number(req.body.page);
        const limit = Number(req.body.limit);
        const skip = (page - 1) * limit;
        const tasks = await Tasks.find({user_id:req.body.user_id}).skip(skip).limit(limit);
        const totalRecords = await Tasks.countDocuments({user_id:req.body.user_id});
        const pages = (totalRecords % limit === 0) ? Math.trunc(totalRecords / limit) : (Math.trunc(totalRecords / limit) + 1);
        if (tasks.length === 0) {
            res.status(200).json({
                status: true,
                message: "Tasks List not found",
                TasksList: tasks,
                page,
                pages,
                pageRecords: tasks.length,
                totalRecords,
            });
        } else
            res.json({
                status: true,
                message: "Tasks List found successfully",
                TasksList: tasks,
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
router.post("/addtask", verifyToken, async (req, res) => {
    console.log(req.body);
    const { task, assigned_by, status, estimateTime, user_id ,task_id} = req.body
    let newTask 
    try {
            if(task_id){
                const tt = await Tasks.updateOne({_id:task_id},
                 { $set:  {
                        user_id: user_id,
                        task: task,
                        assigned_by: assigned_by,
                        status: status,
                        estimateTime: estimateTime
                    }
                 } )
            }else{
             newTask = new Tasks({
                user_id: user_id,
                task: task,
                assigned_by: assigned_by,
                status: status,
                estimateTime: estimateTime
            })
            const savedUser = await newTask.save();
        }
            // console.log(user);
            res.status(201).json({
                status: true,
                message: "Task Added Successfully!!",
            });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: false,
            message: "Unable to add task",
        });
    }
});

router.post("/delete", verifyToken, async (req, res) => {
    try {
        const {id} = req.body;
        console.log(id);
         const result = await Tasks.deleteOne({_id: id})
         console.log(result);
         if(result.deletedCount !== 0){
         res.status(201).json({
           status: true,
           message: "Task deleted successfully!",
         });
       }else {
         res.status(404).json({
           status: false,
           message: "Task do not exits",
         });
       }
     }catch(err) {
           // user id may be incorrect or undefined
           res.status(404).json({
             status: false,
             message: "Unable to fetch Task Data",
           });
     }
});
router.post("/getTask", verifyToken, async (req, res) => {
    try {
        const { id } = req.body;
        const task = await Tasks.findOne({ _id: id });
        if (task) {
            res.status(201).json({
                status: true,
                task: task,
                message: "Task deleted successfully!",
            });
        } else {
            res.status(404).json({
                status: false,
                message: "Task do not exits",
            });
        }
    } catch (err) {
        // user id may be incorrect or undefined
        console.log(err);
        res.status(404).json({
            status: false,
            message: "Unable to fetch Task",
        });
    }
});

module.exports = router;
