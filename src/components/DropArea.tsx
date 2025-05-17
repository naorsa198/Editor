import { useDroppable } from "@dnd-kit/core";
import { forwardRef } from "react";

const DropArea = forwardRef<HTMLDivElement, { children: React.ReactNode, onContextMenu?: any }>(
    ({ children, onContextMenu }, ref) => {
        const { setNodeRef } = useDroppable({ id: 'dropzone' });

        return (
            <div 
                onContextMenu={onContextMenu}
                ref={(node) => {
                    setNodeRef(node);
                    if (typeof ref === 'function') ref(node);
                    else if (ref) ref.current = node;
                }}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '400px',
                    border: '2px dashed #aaa',
                    background: '#f9f9f9',
                    overflow: 'hidden',
                }}
            >
                {children}
            </div>
        );
    });

    export default DropArea