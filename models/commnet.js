module.exports = (sequelize, DataTypes)=>(

    sequelize.define('commnet', {
        title : {
            type : DataTypes.STRING(40),
            allowNull : false,
        },

        contents : {
            type : DataTypes.STRING(200),
            allowNull : false,
        }
    },

        {
            timestamps : true,
            paranoid : true,
        }
    
    )


);