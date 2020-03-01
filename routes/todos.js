const express = require('express');
const {Todo, Comment} = require('../models');

const router = express.Router();


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



module.exports = router;