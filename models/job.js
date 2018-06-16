module.exports = function(sequelize,DataTypes) {
    var job = sequelize.define("job",{
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len:{
                    args:[1,100],
                    msg: "The title needs to be greater than 1 character but shorter than 100 characters long"            
                }
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len:{
                    args:[1,250],
                    msg: "The description needs to be greater than 1 character but shorter than 250 characters long"            
                }
            }
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn:[['Yard Work','Household','Construction','Computer','Babysitting']]
            }
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len:{
                    args:[1,80],
                    msg: "The location needs to be greater than 1 character but shorter than 80 characters long"            
                }
            }
        },
        jobStage: {
            type: DataTypes.STRING,
            defaultValue: "New",
            validate: {
                isIn:[['New','In Progress','Completed']]
            }
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                len:{
                    args:[1],
                    msg: "The rating needs to be of length 1"            
                }
            }
        }
    });
    job.associate = function(models){
        job.belongsTo(models.employer,{
            foreignKey: {
                allowNull:false
            }
        });
        job.belongsTo(models.employee,{
            foreignKey: {
                allowNull:true
            }
        });
    };
    return job;
};