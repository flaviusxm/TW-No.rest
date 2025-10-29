module.exports=(sequelize,DataTypes)=>{
    const Subject=sequelize.define('Subject',{
        subject_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
    },
    name:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,allowNull:true
    },
    created_on:{
        type:DataTypes.DATEONLY,
        defaultValue:DataTypes.NOW
    }
},{
    tableName:'Subjects',
    timestamps:false,
    underscored:true
}
)
return Subject;
}