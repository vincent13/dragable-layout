import { useState } from 'react';
import { Theme } from '../services/types'

interface NewThemeButtonProps {
    onCreated?: (theme: Theme) => void;
}

export function NewThemeButton({ onCreated }: NewThemeButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleCreateTheme = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/themes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'New Theme',
                    background: 'bg-gray-900',
                    fontFamily: 'font-sans',
                    fontSize: 'text-base'
                })
            });

            if (!res.ok) throw new Error('Failed to create theme');
            const newTheme: Theme = await res.json();
            if (onCreated) onCreated(newTheme);
        } catch (err) {
            console.error(err);
            alert('Failed to create theme');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCreateTheme}
            disabled={loading}
            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
            {loading ? 'Creating...' : 'New Theme'}
        </button>
    );
}
