module.exports = function(sequelize,DataTypes) {
    var employee = sequelize.define("employee",{
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
        biography:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len:{
                    args:[1,80],
                    msg: "The email needs to be greater than 1 character but shorter than 80 characters long"            
                }
            }
        },
        rating: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len:{
                    args:[1,80],
                    msg: "The email needs to be greater than 1 character but shorter than 80 characters long"            
                }
            }
        }
    });
    return employee;
};