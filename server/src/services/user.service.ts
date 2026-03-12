import { prisma } from '../config/prisma';

export const syncUser = async (email: string, slug?: string) => {
    const userSlug = slug || email.split('@')[0] + '-' + Math.floor(Math.random() * 10000);
    return await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, slug: userSlug }
    });
};

export const getProStatus = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    return user?.isPro || false;
};

export const upgradeToPro = async (email: string) => {
    return await prisma.user.update({
        where: { email },
        data: { isPro: true }
    });
};

export const findEmailBySlug = async (slug: string) => {
    const user = await prisma.user.findUnique({ where: { slug } });
    return user?.email || null;
};
