'use client';
import Link from 'next/link';

type LayoutActionsProps = {
    layoutId: string;
    onDeleted: () => void;
};

export default function LayoutActions({ layoutId, onDeleted }: LayoutActionsProps) {
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this layout?')) return;

        try {
            const res = await fetch(`/api/layout/${layoutId}`, { method: 'DELETE' });
            if (res.ok) onDeleted();
            else alert('Failed to delete layout');
        } catch (err) {
            console.error(err);
            alert('Error deleting layout');
        }
    };

    return (
        <div className="flex gap-2 mt-auto">
            <Link href={`/viewer/${layoutId}`} className="bg-blue-500 text-white px-3 py-1 rounded">View</Link>
            <Link href={`/editor/${layoutId}`} className="bg-green-500 text-white px-3 py-1 rounded">Edit</Link>
            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleDelete}>Delete</button>
        </div>
    );
}
