import { ReactNode } from 'react';
import DynamicEditorNav from './dynamicEditorNav';

export default async function EditorLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <header className="mb-8">
                {/* Dynamic nav links */}
                <DynamicEditorNav />
            </header>

            <main>{children}</main>
        </div>
    );
}
