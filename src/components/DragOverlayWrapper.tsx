import React from 'react';

interface DragOverlayWrapperProps {
    type: 'input' | 'button' | 'text' | string; // Extendable for more types
}

export const getDraggedElement = (type: string, src?: string | null) => {
    switch (type) {
        case 'input':
            return (
                <input
                    disabled
                    placeholder="Input"
                    style={{
                        padding: '8px 12px',
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        width: '100px',
                    }}
                />
            );
        case 'button':
            return (
                <button
                    disabled
                    style={{
                        padding: '10px 16px',
                        fontSize: '14px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        cursor: 'default',
                    }}
                >
                    Button
                </button>
            );
        case 'text':
            return (
                <div
                    style={{
                        fontSize: '16px',
                        borderColor: 'green',
                        color: '#333',
                        padding: '4px 8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        maxWidth: '300px',
                    }}
                >
                    Sample Text
                </div>
            );
        case 'image':
            return (
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                        alt="small"
                        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                    />
                </div>

            );
        default:
            return (
                <div
                    style={{
                        padding: '8px',
                        border: '1px dashed #aaa',
                        borderRadius: '4px',
                        backgroundColor: '#f5f5f5',
                        fontSize: '12px',
                        color: '#666',
                    }}
                >
                    Unknown type: {type}
                </div>
            );
    }
}

const DragOverlayWrapper: React.FC<DragOverlayWrapperProps> = ({ type }) => {
    return (
        getDraggedElement(type)
    )
};

export default DragOverlayWrapper;
