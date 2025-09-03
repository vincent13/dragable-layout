type WidgetProps = {
    id: string;
    title?: string;
    onRemove?: (id: string) => void;
};

export default function Widget({ id, title, onRemove }: WidgetProps) {
    return (
        <div className="p-4 border rounded bg-white shadow flex flex-col items-center justify-center">
            <h3 className="font-bold text-lg">{title ?? `Widget ${id}`}</h3>
            <p className="text-sm text-gray-500">Custom content goes here</p>
            {onRemove && (
                <button
                    onClick={() => onRemove(id)}
                    className="mt-2 px-3 py-1 text-white bg-red-500 rounded"
                >
                    Remove
                </button>
            )}
        </div>
    );
}
