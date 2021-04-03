'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Copy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Copy.init(
    {
      bookId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Books', // 'Movies' would also work
          key: 'id'
        }
      },
    }, 
    {
      sequelize,
      tableName: 'copies',
      modelName: 'Copy',
    }
  );
  return Copy;
};