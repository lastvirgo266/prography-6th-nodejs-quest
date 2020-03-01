module.exports = (sequelize, DataTypes)=>(

    sequelize.define('todo', {
        title : {
            type : DataTypes.STRING(40),
            allowNull : false,
        },

        description : {
            type : DataTypes.STRING(200),
            allowNull : false,
        },

        tags:{
            type : DataTypes.ARRAY(DataTypes.STRING(50)),
            allowNull : true,
        },

        isCompleted : {
            type : DataTypes.BOOLEAN(),
            allowNull : false,
            defaultValue : false,
        }
    },

        {
            timestamps : true,
            paranoid : true,
        }
    
    )


);