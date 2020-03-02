const express = require('express');
const {Todo, Comment} = require('../models');

const router = express.Router();


/* Todos API  */
router.post('/', (req,res,next)=>{

    console.log(req.body);
    const { title, description, tags } = req.body;

        Todo.create({
            title,
            description,
            tags : JSON.stringify(tags)
        })
        .then(result =>{
            return res.status(200).json(result)
        })
        .catch(err =>{
            console.error(err);
            return res.status(500);
        })

});

router.get('/', (req,res,next)=>{
    Todo.findAll()
    .then((result) =>{
        return res.status(200).json(result);
    })
    .catch(err=>{
        console.error(err);
        return res.status(500);
    })
});


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


router.put('/:id/complete', (req,res,next)=>{
    Todo.update({ 
        isCompleted : 1,
    },{where : {id : req.params.id}})
    .then(() => {return Todo.findByPk(req.params.id)})
    .then(result =>{
        return res.status(200).json(result);
    })
    .catch(err=>{
        console.error(err);
        return res.status(500);
    })
});



router.delete('/:id', (req,res,next)=>{
    Todo.destroy({where : {id : req.params.id}})
    .then(()=>{
        return res.status(200).json({
            msg : "suceess"
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

    Comment.findAll({where : {todoId : req.params.todoId}})
    .then((result) =>{
        return res.status(200).json(result[req.params.commentId-1]);
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

    Comment.findAll({where : {todoId : req.params.todoId}})
    .then((results) =>{
        Comment.update({
            contents
        },
        {where : {id : results[req.params.commentId-1].id}}
        )
        .then(()=>{
            return Comment.findByPk(results[req.params.commentId-1].id);
        })
        .then(result=>{
            return res.status(200).json(result);
        })
        .error(err =>{
            console.error(err);
            return res.status(500).json({
                msg : "오류!"
            })
        })
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

    Comment.findAll({where : {todoId : req.params.todoId}})
    .then((results) =>{
        Comment.destroy(
        {where : {id : results[req.params.commentId-1].id}}
        )
        .then(()=>{
            return res.status(200).json({
                msg : "success"
            });
        })
        .error(err =>{
            console.error(err);
            return res.status(500).json({
                msg : "오류!"
            })
        })
    })
    .catch(err=>{
        console.error(err);
        return res.status(500).json({
            msg : "존재하지 않습니다."
        })
    })
});

module.exports = router;