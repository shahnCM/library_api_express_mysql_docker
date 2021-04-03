'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('authorbook', {
      
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'authors', // 'Movies' would also work
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
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
    await queryInterface.dropTable('authorbook')
  }
};