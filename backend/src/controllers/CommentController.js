const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const formatComment = (comment) => {
    return {
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: {
            username: comment.author.username,
            bio: comment.author.bio,
            image: comment.author.image,
            following: false,
        }
    }
}
const addComment = async (req, res) => {
    try {
        const { body } = req.body.comment;
        const { slug } = req.params;
        const userId = req.user.id;
        const comment = await prisma.comment.create({
            data: {
                body,
                author: { connect: { id: userId } },
                article: { connect: { slug: slug } }
            },
            include: {
                author: true,
            }
        })
        res.status(201).json({ comment: formatComment(comment) });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } });
    }
}
const getComments = async (req, res) => {
    try {
        const { slug } = req.params;
        const comments = await prisma.comment.findMany({
            where: { article: { slug: slug } },
            orderBy: { createdAt: 'desc' },
            include: {
                author: true,
            }
        })
        res.status(200).json({ comments: comments.map(formatComment) });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } });
    }
}
const deleteComment = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user.id;
        const comment = await prisma.comment.findUnique({ where: { id: id } });
        if (!comment) {
            return res.status(404).json({ errors: { body: ['Comment not found'] } });
        }
        if (comment.authorId !== userId) {
            return res.status(403).json({ errors: { body: ['You can only delete your own comment'] } });
        }
        await prisma.comment.delete({ where: { id: id } });
        res.status(204).json({});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } });
    }
}

module.exports = {
    addComment,
    getComments,
    deleteComment,
};