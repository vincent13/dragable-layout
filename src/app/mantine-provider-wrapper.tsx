'use client';

import { MantineProvider } from '@mantine/core';
import type { ReactNode } from 'react';

export default function MantineProviderWrapper({ children }: { children: ReactNode }) {
    return (
        <MantineProvider>
            {children}
        </MantineProvider>
    );
}

