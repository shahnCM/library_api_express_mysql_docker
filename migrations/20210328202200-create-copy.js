'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('copies', {
      
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'books', // 'Movies' would also work
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1 // 1 for Available & 0 for notAvailable
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('copies');
  }
};