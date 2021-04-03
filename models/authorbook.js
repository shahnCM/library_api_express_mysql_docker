'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuthorBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AuthorBook.init(
    {
      authorId: {
        type: DataTypes.INTEGER,
        references: {
          modle: 'Authors', // 'Authors' would also work
          key: 'id'
        }
      },
      bookId: { 
        type: DataTypes.INTEGER,
        references: {
          model: 'Books',
          key: 'id'
        }
      }
    }, 
    {
      sequelize,
      tableName:'authorbook',
      modelName: 'AuthorBook',
    }
  );
  return AuthorBook;
};