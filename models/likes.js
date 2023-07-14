'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        targetKey: 'userId', 
        foreignKey: 'UserId', 
      });

      this.belongsTo(models.Posts, {
        targetKey: 'postId', 
        foreignKey: 'PostId',
      });
    }
  }
  Likes.init({
    likeId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    UserId: {
      allowNull: false ,
      type: DataTypes.INTEGER,
      references: {
        model: 'users', 
        key: 'UserId', 
      },
      onDelete: 'CASCADE',
    },
    PostId :{
      allowNull: false ,
      type: DataTypes.INTEGER,
      references: {
      model: 'posts', 
      key: 'PostId', 
    },
    onDelete: 'CASCADE',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Likes',
  });
  return Likes;
};