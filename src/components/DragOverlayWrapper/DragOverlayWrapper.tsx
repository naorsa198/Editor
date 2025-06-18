import React from 'react';
import './DragOverlayWrapper.css';

interface DragOverlayWrapperProps {
    type: 'input' | 'button' | 'text' | 'image' | string;
    data?: { text?: string; src?: string } | null;
}

export function getDraggedElement(
    type: string,
    props: {
        id: string;
        data?: { text?: string; src?: string } | null;
    }
) {
    const defaultImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg';

    switch (type) {
        case 'text':
            return (
                <textarea
                    className="dragoverlay-textarea"
                    value={props.data?.text || ''}
                    placeholder="Write here..."
                />
            );
        case 'image':
            return (
                <div className="dragoverlay-image-container">
                    <img    
                        className="dragoverlay-image"
                        src={props.data?.src || defaultImageUrl}
                        alt=""
                    />
                    <div className="dragoverlay-image-label">
                        {props.data?.src ? "" : 'Drag to upload'}
                    </div>
                </div>
            );
        case 'input':
            return (
                <input
                    className="dragoverlay-input"
                    disabled
                    placeholder="Input"
                />
            );
        case 'button':
            return (
                <button
                    className="dragoverlay-button"
                    onClick={(e) => console.log('Button clicked')}
                >
                    Button
                </button>
            );
        default:
            return (
                <div className="dragoverlay-unknown">
                    Unknown type: {type}
                </div>
            );
    }
}

const DragOverlayWrapper = ({ type, data }: DragOverlayWrapperProps) => {
    return getDraggedElement(type, {
        id: 'default-id',
        data,
    });
};

export default DragOverlayWrapper;
