const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const slugify = require('slugify'); // 也就是把 "Hello World" 变成 "hello-world"


const formatArticle = (article, user) => {
    return {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList.map(t => t.name),
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: false,
        favoritesCount: 0,
        author: {
            username: article.author.username,
            bio: article.author.bio,
            image: article.author.image,
            following: false,
        }
    }
}
const createArticle = async (req, res) => {
    try {
        const { title, description, body, tagList } = req.body.article;
        const authorId = req.user.id; // 这里的 user 是由 authMiddleware 提供的

        // 1. 生成 Slug (URL 别名)
        // 比如标题是 "My New Post"，Slug 就是 "my-new-post"
        // 为了防止重复，我们可以在后面加个随机数
        let slug = slugify(title, { lower: true });
        const uniqueSuffix = Math.random().toString(36).substring(7);
        slug = `${slug}-${uniqueSuffix}`;

        // 2. 存入数据库
        const article = await prisma.article.create({
            data: {
                title,
                description,
                body,
                slug,
                author: { connect: { id: authorId } }, // 关联作者
                // 处理标签：如果标签库里有就直接连，没有就创建
                tagList: {
                    connectOrCreate: (tagList || []).map(tag => ({
                        where: { name: tag },
                        create: { name: tag },
                    })),
                },
            },
            include: {
                author: true,
                tagList: true,
                favoritedBy: true,
            },
        });

        // 3. 格式化返回数据
        const articleObj = formatArticle(article, req.user);
        res.status(201).json({ article: articleObj });

    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } });
    }
};
const getArticle = async (req, res) => {
    try {
        const { slug } = req.params;
        const article = await prisma.article.findUnique({
            where: { slug: slug },
            include: {
                author: true,
                tagList: true,
                favoritedBy: true,
            },
        });

        if (!article) {
            return res.status(404).json({ errors: { body: ['Article not found'] } });
        }

        const articleObj = formatArticle(article, req.user);

        res.json({ article: articleObj });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } });
    }
};

const listArticles = async (req, res) => {
    try {
        const { tag, author, favorited, limit = 20, offset = 0 } = req.query;
        const where = {}
        if (tag) {
            where.tagList = { some: { name: tag } }
        }
        if (author) {
            where.author = { username: author }
        }
        if (favorited) {
            where.favoritedBy = { some: { username: favorited } }
        }
        const [articles, articlesCount] = await Promise.all([
            prisma.article.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: Number(limit),
                skip: Number(offset),
                include: {
                    author: true,
                    tagList: true,
                    favoritedBy: true
                }
            }),
            prisma.article.count({ where })
        ])
        res.json({ articles: articles.map(article => formatArticle(article, req.user)), articlesCount })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } })
    }
}
const feedArticles = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const userId = req.user.id
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                following: true,
            }
        });
        const followingIds = user.following.map(following => following.id);
        const where = {
            authorId: { in: followingIds }
        };
        const [articles, articlesCount] = await Promise.all([
            prisma.article.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: Number(limit),
                skip: Number(offset),
                include: {
                    author: true,
                    tagList: true,
                    favoritedBy: true
                }
            }),
            prisma.article.count({ where })
        ])
        res.json({ articles: articles.map(article => formatArticle(article, req.user)), articlesCount })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } })
    }
}

const updateArticle = async (req, res) => {
    try {
        const { slug } = req.params;
        const { title, description, body, tagList } = req.body.article;
        const userId = req.user.id;
        const article = await prisma.article.findUnique({ where: { slug } });
        if (!article) {
            return res.status(404).json({ errors: { body: ['Article not found'] } });
        }
        if (article.authorId !== userId) {
            return res.status(403).json({ errors: { body: ['Unauthorized'] } });
        }
        const dataToUpdate = {};
        if (title) {
            dataToUpdate.title = title;
        }
        if (description) {
            dataToUpdate.description = description;
        }
        if (body) {
            dataToUpdate.body = body;
        }
        if (tagList) {
            dataToUpdate.tagList = {
                set: [],
                connectOrCreate: tagList.map(tag => ({
                    where: { name: tag },
                    create: { name: tag }
                }))
            }
        }
        dataToUpdate.updatedAt = new Date();
        const updatedArticle = await prisma.article.update({
            where: { slug },
            data: dataToUpdate,
            include: {
                author: true,
                favoritedBy: true,
                tagList: true
            }
        })
        res.json({ article: formatArticle(updatedArticle, req.user) })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } })
    }
}
const deleteArticles = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.user.id;
        const article = await prisma.article.findUnique({ where: { slug } });
        if (!article) {
            return res.status(404).json({ errors: { body: ['Article not found'] } });
        }
        if (article.authorId != userId) {
            return res.status(403).json({ errors: { body: ['Unauthorized'] } })
        }
        await prisma.article.delete({ where: { slug } });
        res.json({})
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } })
    }
}
const favoriteArticle = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.user.id;

        const article = await prisma.article.update({
            where: { slug },
            data: {
                favoritedBy: {
                    connect: { id: userId }
                }
            },
            include: {
                author: true,
                tagList: true,
                favoritedBy: true,
            }
        });
        res.json({ article: formatArticle(article, req.user) });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } });
    }
};

const unfavoriteArticle = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.user.id;

        const article = await prisma.article.update({
            where: { slug },
            data: {
                favoritedBy: {
                    disconnect: { id: userId }
                }
            },
            include: {
                author: true,
                tagList: true,
                favoritedBy: true,
            }
        });
        res.json({ article: formatArticle(article, req.user) });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } });
    }
};

const getTags = async (req, res) => {
    try {
        const tags = await prisma.tag.findMany();
        res.json({ tags: tags.map(t => t.name) });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } });
    }
};

module.exports = {
    createArticle,
    getArticle,
    listArticles,
    updateArticle,
    deleteArticles,
    feedArticles,
    getTags,
    favoriteArticle,
    unfavoriteArticle
};