'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Book }) {
      this.belongsTo(User, {foreignKey: 'userId', as: 'RequestedBy'})
      this.belongsTo(User, {foreignKey: 'handledBy', as: 'HandledBy'}) 
      this.belongsTo(Book, {foreignKey: 'bookId'}) 
    }
  };
  Request.init(
    {
      bookId: {
        type: DataTypes.INTEGER,        
        references: {
          model: 'Books', // 'Movies' would also work
          key: 'id'
        }
      },
      
      copyId: {
        type: DataTypes.INTEGER,        
        references: {
          model: 'Copies', // 'Movies' would also work
          key: 'id'
        }
      },

      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users', // 'Movies' would also work
          key: 'id'
        }
      },

      handledBy: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users', // 'Movies' would also work
          key: 'id'
        }
      },

      status: DataTypes.STRING,
      requestType : DataTypes.STRING,
      trackingId: DataTypes.STRING,
    }, 
    {
      sequelize,
      tableName: 'requests',
      modelName: 'Request',
    }
  );
  return Request;
};