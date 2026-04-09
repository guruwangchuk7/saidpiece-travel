'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type HeaderTheme = 'auto' | 'light';

interface UIContextType {
    headerTheme: HeaderTheme;
    setHeaderTheme: (theme: HeaderTheme) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [headerTheme, setHeaderTheme] = useState<HeaderTheme>('auto');

    return (
        <UIContext.Provider value={{ headerTheme, setHeaderTheme }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
