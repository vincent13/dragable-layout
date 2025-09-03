type WidgetProps = {
    id: string;
    title?: string;
    onRemove?: (id: string) => void;
};

export default function Widget({ id, title, onRemove }: WidgetProps) {
    return (
        <div className="relative p-4 flex flex-col items-center justify-center">
            {/* Remove Button (X) */}
            {onRemove && (
                <button onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.(id);
                    }} className="no-drag absolute top-1 right-1 text-gray-500 hover:text-red-600 font-bold">✕</button>
            )}

            {/* Content */}
            <h3 className="font-bold text-lg">{title ?? `Widget ${id}`}</h3>
            <p className="text-sm text-gray-500">content</p>
        </div>
    );
}
