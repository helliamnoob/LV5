const { Posts } = require('../models');

class PostRepository {
  findAllPost = async () => {
    const posts = await Posts.findAll();

    return posts;
  };

  findPostById = async (postId) => {
    const post = await Posts.findByPk(postId);

    return post;
  };

  createPost = async (title, content, userId) => {
    const createPostData = await Posts.create({
      title,
      content,
      userId,
    });

    return createPostData;
  };

  updatePost = async (postId, userId, title, content) => {
    const updatePostData = await Posts.update(
      { title, content },
      { where: { postId, userId } }
    );

    return updatePostData;
  };

  deletePost = async (postId, userId) => {
    const updatePostData = await Posts.destroy({ where: { postId, userId } });

    return updatePostData;
  };
}

module.exports = PostRepository;