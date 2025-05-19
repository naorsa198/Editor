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
        onTextChange?: (id: string, text: string) => void;
        onImageChange?: (id: string, src: string) => void;
        onFocus?: () => void;
        onBlur?: () => void;
    }
) {
    const defaultImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg';

    switch (type) {
        case 'text':
            return (
                <textarea
                    className="dragoverlay-textarea"
                    value={props.data?.text || ''}
                    onFocus={props.onFocus}
                    onBlur={props.onBlur}
                    onChange={e => props.onTextChange?.(props.id, e.target.value)}
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
                    {props.onImageChange && (
                        <input
                            type="file"
                            accept="image/*"
                            onPointerDown={e => {
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = ev => props.onImageChange?.(props.id, ev.target?.result as string);
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    )}
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
