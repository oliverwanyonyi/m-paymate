module.exports = (sequelize,Sequelize) =>{
    const bill  = sequelize.define('bills',{
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          expense: {
            type: Sequelize.STRING,
            allowNull: false,
          
          },
          amount: {
            type: Sequelize.DECIMAL(10, 2), // Assuming decimal for amount, adjust as necessary
            allowNull: false
          },

          expense_id:{
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'expenditures',
              key: 'id'
            }
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id'
            }
          },
          status:{
            type: Sequelize.ENUM(
              "pending",
              "partially-paid",
              "paid",
            ),
            
            defaultValue:'pending'
          }, 
          balance: {
            type:Sequelize.DOUBLE(10,2),
    
          },
          due_date: {
            allowNull: false,
            type: Sequelize.DATE
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

    return bill
}