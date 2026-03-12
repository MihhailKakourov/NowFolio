export interface User {
    id: string;
    email: string;
    name?: string;
    bio?: string;
    avatarUrl?: string;
    slug: string;
    socialAccounts?: Record<string, string>;
    createdAt: string;
    updatedAt: string;
    isPro: boolean;
    stripeCustomerID?: string;
}
