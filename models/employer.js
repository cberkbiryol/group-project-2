module.exports = function(sequelize,DataTypes) {
    var employer = sequelize.define("employer",{
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len:{
                    args:[1,140],
                    msg: "The name needs to be greater than 1 character but shorter than 140 characters long"            
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    employer.associate = function(models){
        employer.hasMany(models.job,{
            onDelete: "cascade"
        })
    }
    return employer;
};