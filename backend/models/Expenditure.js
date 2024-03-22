module.exports = (sequelize,Sequelize) =>{
    const expenditure = sequelize.define('expenditures',{
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique:true
          },
          amount: {
            type: Sequelize.DOUBLE(10, 2), 
            allowNull: false
          },
          category_id:{
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              model: 'budget_categories',
              key: 'id'
            },
            onDelete:"CASCADE"
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id'
            }
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
    })

    return expenditure
}