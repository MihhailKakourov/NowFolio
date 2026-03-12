interface ProPlanCardProps {
    isPro: boolean | null;
    isButtonDisabled: boolean;
    isPaymentLoading: boolean;
    onSubscribe: () => void;
}

export const ProPlanCard = ({ isPro, isButtonDisabled, isPaymentLoading, onSubscribe }: ProPlanCardProps) => {
    return (
        <div className="mt-8 card p-8 sm:p-10 max-w-sm border-t-4 border-t-gruvbox-blueLight hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-gruvbox-blueLight mb-2">Pro Plan</h2>
            <p className="text-gruvbox-fg4 mb-6 leading-relaxed">
                Получите неограниченный доступ ко всем функциям и премиум поддержке навсегда.
            </p>

            <p className="text-5xl font-extrabold text-gruvbox-fg0">
                $0 <span className="text-lg font-medium text-gruvbox-fg4">/ навсегда</span>
            </p>

            {isPro ? (
                <button
                    disabled
                    className="mt-8 w-full bg-gruvbox-bg3 text-gruvbox-fg4 font-bold py-3 rounded-lg cursor-not-allowed border border-gruvbox-bg4 shadow-inner"
                >
                    ✓ Активно
                </button>
            ) : (
                <button
                    onClick={onSubscribe}
                    disabled={isButtonDisabled}
                    className={`btn-primary mt-8 flex items-center justify-center gap-2 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isPro === null ? 'Загрузка...' : isPaymentLoading ? 'Переход к оплате...' : 'Купить Pro'}
                    {!isButtonDisabled && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    );
};
