'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      
      profilePic: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('users');
  }
};

/*
INSERT INTO `library_db`.`users` (`id`, `name`, `email`, `createdAt`, `updatedAt`) VALUES ('1', 'User 1', 'user@user.1', '2021-03-30 01:54:53', '2021-03-30 01:54:54');
SELECT `id`, `name`, `email`, `isAdmin`, `profilePic`, `createdAt`, `updatedAt` FROM `library_db`.`users` WHERE  `id`=1;
INSERT INTO `library_db`.`users` (`id`, `name`, `email`, `createdAt`, `updatedAt`) VALUES ('2', 'User 2', 'user@user.2', '2021-03-30 01:55:14', '2021-03-30 01:55:15');
SELECT `id`, `name`, `email`, `isAdmin`, `profilePic`, `createdAt`, `updatedAt` FROM `library_db`.`users` WHERE  `id`=2;
INSERT INTO `library_db`.`users` (`id`, `name`, `email`, `isAdmin`, `createdAt`, `updatedAt`) VALUES ('3', 'Admin 1', 'admin@admin.1', '1', '2021-03-30 01:55:37', '2021-03-30 01:55:38');
SELECT `id`, `name`, `email`, `isAdmin`, `profilePic`, `createdAt`, `updatedAt` FROM `library_db`.`users` WHERE  `id`=3;
*/