'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Request, Author }) {
      // define association here
      this.belongsToMany(Author, { through: 'authorbook' })
      this.hasMany(Request, {foreignKey: 'bookId'}) 
    }
  };
  Book.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING
    }, 
    {
      sequelize,
      tableName: 'books',
      modelName: 'Book',
    }
  );
  return Book;
};