'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('requests', {
      
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

      copyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        foreignKey: true,
        references: {
          model: 'copies', // 'Movies' would also work
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'users', // 'Movies' would also work
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      
      handledBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        foreignKey: true,
        references: {
          model: 'users', // 'Movies' would also work
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      
      requestType: {
        type: Sequelize.STRING,
        allowNull: false
        // loan
        // return
      },

      trackingId: {
        type: Sequelize.STRING,
        allowNull: false
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false
        // rejected
        // accetpted
        // pending
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
    await queryInterface.dropTable('requests');
  }
};