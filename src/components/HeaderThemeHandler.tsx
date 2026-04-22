'use client';

import { useEffect } from 'react';
import { useUI } from '@/contexts/UIContext';

export default function HeaderThemeHandler({ theme }: { theme: 'auto' | 'light' }) {
    const { setHeaderTheme } = useUI();

    useEffect(() => {
        setHeaderTheme(theme);
    }, [theme, setHeaderTheme]);

    return null;
}
