'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users,{
        targetKey: 'userId', //Users DB key값
        foreignKey: 'UserId', //Posts
      });
      this.hasMany(models.Comments, {
        sourceKey: 'postId',
        foreignKey: 'PostId',
      });
      this.hasMany(models.Likes, {
        sourceKey: 'postId', 
        foreignKey: 'PostId', // 4. Likes 모델의 PostId 컬럼과 연결합니다.
      });
    }
  }
  Posts.init({
    postId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references:{
        model:'Users',
        key:'userId',
      },
      onDelete: 'CASCADE'// 만약 Users 모델에서 userId가 삭제되면, Posts에서 UserId도 삭제
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    content: {
      allowNull: false,
      type: DataTypes.STRING
    },
    like:{
      type: DataTypes.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};