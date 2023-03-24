'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Likes', {
      likeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId : {
        allowNull: false, 
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', 
          key: 'userId', 
        },
        onDelete: 'CASCADE',
      },
      postId : {
        allowNull: false, 
        type: Sequelize.INTEGER,
        references: {
          model: 'Posts', 
          key: 'postId', 
        },
        onDelete: 'CASCADE',
      },
      isLike: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Likes');
  }
};