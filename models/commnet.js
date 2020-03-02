module.exports = (sequelize, DataTypes)=>(

    sequelize.define('commnet', {

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