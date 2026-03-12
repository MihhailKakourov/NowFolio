import type { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
}

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md card p-8 sm:p-10">
                <h1 className="text-3xl font-extrabold text-center mb-8 text-gruvbox-orangeLight tracking-tight">
                    {title}
                </h1>
                {children}
            </div>
        </div>
    );
};
