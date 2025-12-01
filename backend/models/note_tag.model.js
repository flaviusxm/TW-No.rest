
module.exports=(sequelize,DataTypes)=>{
    const NoteTag=sequelize.define('NoteTag',{
        note_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            references:{
                model:'Notes',
                key:'note_id'
            }
        },
        tag_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            references:{
                model:'Tags',
                key:'tag_id'
            }
        }
    },{
        tableName:'Notes_Tags',
        timestamps:false,
        underscored:true
    })
    return NoteTag;
}