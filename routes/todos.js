const express = require('express');
const {Todo, Comment} = require('../models');
const sequelize = require('sequelize');
const op = sequelize.Op;
const router = express.Router();


/* Todos API  */

//post todo
router.post('/', (req,res,next)=>{

    console.log(req.body);
    const { title, description, tags } = req.body;

        Todo.create({
            title,
            description,
            tags : JSON.stringify(tags)
        })
        .then(result =>{
            result.tags = JSON.parse(result.tags);
            return res.status(200).json(result)
        })
        .catch(err =>{
            console.error(err);
            return res.status(500);
        })

});

//Get all todos(Add use the order query)
router.get('/', (req,res,next)=>{

    //order function
    if(req.query.order != undefined){
        console.log(req.query.order);
        let orderKey= Object.keys(req.query.order)[0];
        var orderValue = Object.values(req.query.order)[0];

        Todo.findAll({
            order : [[orderKey, orderValue]]
        })
        .then((result) =>{
            
            for(var i=0; i< result.length; i++)
                result[i].tags = JSON.parse(result[i].tags);

            return res.status(200).json(result);
        })
        .catch(err=>{
            console.error(err);
            return res.status(500);
        })
    }

    //Search function
    else if(req.query.title != undefined){
        console.log(req.query.title);
        let keyword= req.query.title;

        Todo.findAll({
           where : {
               title :{ 
                [op.like] : keyword 
            }
          }
        })
        .then((result) =>{
            
            for(var i=0; i< result.length; i++)
                result[i].tags = JSON.parse(result[i].tags);

            return res.status(200).json(result);
        })
        .catch(err=>{
            console.error(err);
            return res.status(500);
        })
    }

    //serach description
    else if(req.query.description != undefined){
        console.log(req.query.description);
        let keyword= req.query.description;

        Todo.findAll({
           where : {
               description :{ 
                [op.like] : keyword 
            }
          }
        })
        .then((result) =>{
            
            for(var i=0; i< result.length; i++)
                result[i].tags = JSON.parse(result[i].tags);

            return res.status(200).json(result);
        })
        .catch(err=>{
            console.error(err);
            return res.status(500);
        })
    }

    //search tags
    else if(req.query.tags != undefined){
        console.log(req.query.order);
        let orderKey= Object.keys(req.query.order)[0];
        var orderValue = Object.values(req.query.order)[0];

        Todo.findAll({
            order : [[orderKey, orderValue]]
        })
        .then((result) =>{
            
            for(var i=0; i< result.length; i++)
                result[i].tags = JSON.parse(result[i].tags);

            return res.status(200).json(result);
        })
        .catch(err=>{
            console.error(err);
            return res.status(500);
        })
    }


    else{
        Todo.findAll()
        .then((result) =>{
            
            for(var i=0; i< result.length; i++)
                result[i].tags = JSON.parse(result[i].tags);

            return res.status(200).json(result);
        })
        .catch(err=>{
            console.error(err);
            return res.status(500);
        })
    }
});


//Get specify todo
router.get('/:id', (req,res,next)=>{

    Todo.findOne({where : {id : req.params.id}})
    .then(result =>{
        return res.status(200).json(result);
    })
    .catch(err=>{
        console.error(err);
        return res.status(500);
    })

});


//update todo
router.put('/:id', (req,res,next)=>{
    const { title, description, tags } = req.body;
    Todo.update({
        title,
        description,
        tags
    },
        {where : {id : req.params.id}})
    .then(() =>{
        return res.status(200).json({
            title,
            description,
            tags
        });
    })
    .catch(err=>{
        console.error(err);
        return res.status(500);
    })
});


//Complete todo
router.put('/:id/complete', (req,res,next)=>{
    Todo.update({ 
        isCompleted : 1,
    },{where : {id : req.params.id}})
    .then(() => {return Todo.findByPk(req.params.id)})
    .then(result =>{
        result.tags = JSON.parse(result.tags);
        return res.status(200).json(result);
    })
    .catch(err=>{
        console.error(err);
        return res.status(500);
    })
});


//Delete todo
router.delete('/:id', (req,res,next)=>{
    Todo.destroy({where : {id : req.params.id}})
    .then(()=>{
        return res.status(200).json({
            msg : "success"
        });
    })
    .catch(err=>{
        console.error(err);
        return res.status(500);
    })
});


/* Comment API  */

//Create comment
router.post('/:id/comments', (req,res,next)=>{

    console.log(req.body);
    const { contents } = req.body;
        Comment.create({
            contents,
            todoId : req.params.id
        })
        .then(result =>{
            return res.status(200).json(result)
        })
        .catch(err =>{
            console.error(err);
            return res.status(500).json({
                msg : "해당 게시물이 존재하지 않습니다."
            });
        })

});




//Read all comments
router.get('/:id/comments', (req,res,next)=>{
    Comment.findAll({where : {todoId : req.params.id}})
    .then((result) =>{
        return res.status(200).json(result);
    })
    .catch(err=>{
        console.error(err);
        return res.status(500);
    })
});


//Read Specify comments
router.get('/:todoId/comments/:commentId', (req,res,next)=>{
    Comment.findOne({ where : {id : req.params.commentId, todoId : req.params.todoId},
        attributes: { exclude: ['todoId'] } })
    .then(result=>{
        return res.status(200).json(result);
    })
    .catch(err=>{
        console.error(err);
        return res.status(500).json({
            msg : "존재하지 않습니다."
        })
    })
});


//Revise comment
router.put('/:todoId/comments/:commentId', (req,res,next)=>{
    const {contents} = req.body;
    Comment.update({
        contents
     },{ where : {id : req.params.commentId, todoId : req.params.todoId} })
    .then(()=>{
        return Comment.findByPk(req.params.commentId,{
            attributes: { exclude: ['todoId'] }
        });
    })
    .then(result=>{
        return res.status(200).json(result);
    })
    .catch(err=>{
        console.error(err);
        return res.status(500).json({
            msg : "존재하지 않습니다."
        })
    })
});


//Delete Comment
router.delete('/:todoId/comments/:commentId', (req,res,next)=>{
    Comment.destroy({ where : {id : req.params.commentId, todoId : req.params.todoId},
        attributes: { exclude: ['todoId'] } })
    .then(result=>{
        return res.status(200).json({
            msg : "success"
        });
    })
    .catch(err=>{
        console.error(err);
        return res.status(500).json({
            msg : "존재하지 않습니다."
        })
    })
});

module.exports = router;