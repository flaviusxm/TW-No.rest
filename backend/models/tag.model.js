module.exports=(sequelize,DataTypes)=>{
    const Tag=sequelize.define('Tag',{
        tag_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:DataTypes.STRING(50),
            unique:true,
            allowNull:false
        }
    },{
        tableName:'Tags',
        timestamps:false,
        underscored:true
    });
    return Tag;
}