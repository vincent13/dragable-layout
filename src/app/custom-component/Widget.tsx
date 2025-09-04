// Widget.tsx
import React, { ReactNode } from 'react';

interface WidgetProps {
    id: string;
    title: string;
    onRemove?: (id: string) => void;
    children?: ReactNode;
    readOnly?:boolean;
}

const Widget: React.FC<WidgetProps> = ({ id, title, onRemove, children, readOnly=false }) => {
    return (
        <div className="border rounded p-2 relative bg-white">
            {title && <h4 className="font-bold mb-2">{title}</h4>}
            {children}
            {!readOnly && onRemove && (<button
                onClick={() => onRemove(id)}
                style={{ position: 'absolute', top: 5, right: 5 }}
            >
                ×
            </button>)}
        </div>
    );
};

export default Widget;
