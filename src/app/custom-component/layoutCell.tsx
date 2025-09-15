'use client';
import LayoutActions from './layoutActions';

type LayoutCellProps = {
    layoutname: string;
    layoutId: string;
    onDeleted: (id: string) => void;
};

export default function LayoutCell({ layoutname, layoutId, onDeleted }: LayoutCellProps) {
    return (
        <div className="border p-4 rounded shadow flex flex-col gap-2">
            <div className="font-bold">{layoutname}</div>
            <LayoutActions layoutId={layoutId} onDeleted={() => onDeleted(layoutId)} />
        </div>
    );
}
