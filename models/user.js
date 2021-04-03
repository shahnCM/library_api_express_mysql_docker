'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Request }) {
      // define association here
      this.hasMany(Request, {foreignKey: 'userId'})
      this.hasMany(Request, {foreignKey: 'handledBy'})
    }
  };
  User.init(
    {
      name:       DataTypes.STRING,
      password:   DataTypes.STRING,
      email:      DataTypes.STRING,
      isAdmin:    DataTypes.BOOLEAN,
      profilePic: DataTypes.STRING
    }, 
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
    }
  );
  return User;
};