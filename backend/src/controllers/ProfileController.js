const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const userId = req.user ? req.user.id : null;

        const profile = await prisma.user.findUnique({
            where: { username: username },
            include: {
                followedBy: true,
            }
        });

        if (!profile) {
            return res.status(404).json({ errors: { body: ['User not found'] } });
        }

        const isFollowing = userId
            ? profile.followedBy.some((user) => user.id === userId)
            : false;

        res.json({
            profile: {
                username: profile.username,
                bio: profile.bio,
                image: profile.image,
                following: isFollowing,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } });
    }
};

const followUser = async (req, res) => {
    const { username } = req.params;
    const userId = req.user.id; // 我自己

    try {
        // 思路逆转：与其“我关注他”，不如“修改他，把我的ID加到他的粉丝里”
        // 这样 update 返回的就是“他”的信息，可以直接返回给前端，一举两得！
        const user = await prisma.user.update({
            where: { username: username }, // 找到目标用户
            data: {
                followedBy: { connect: { id: userId } } // 粉丝里加上我
            }
        });

        res.json({
            profile: {
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: true, // 既然刚关注成功，那肯定是 true
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } });
    }
};

const unfollowUser = async (req, res) => {
    const { username } = req.params;
    const userId = req.user.id;

    try {
        const user = await prisma.user.update({
            where: { username: username },
            data: {
                followedBy: { disconnect: { id: userId } } // 粉丝里踢掉我
            }
        });

        res.json({
            profile: {
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: false,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: { body: ['Server error'] } });
    }
};

module.exports = {
    getProfile,
    followUser,
    unfollowUser
};