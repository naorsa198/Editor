import { useEffect, useRef, useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
} from '@dnd-kit/core';
import DraggableItem from '../DraggableItem';
import Sidebar from '../Sidebar';
import DropArea from '../DropArea';
import DragOverlayWrapper from '../DragOverlayWrapper';
import './Editor.css'
import Viewer from '../Viewer';

// Each toolbox item has an id and a label
const initialItems = [
    { id: 'text', label: 'Text' },
    { id: 'input', label: 'Input' },
    { id: 'button', label: 'Button' },
    { id: 'image', label: 'Image', src: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" }
];

type ItemData = {
    id: string;
    type: any;
    x: number;
    y: number;
};

export default function Editor() {
    const [itemsInCanvas, setItemsInCanvas] = useState<ItemData[]>([]);
    const [activeType, setActiveType] = useState<string | any>(null);
    const [contextItemId, setContextItemId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [menuType, setMenuType] = useState<'element' | 'droparea' | null>(null);
    const [dragEnabled, setDragEnabled] = useState(true);
    const [rightElementClicked, setRightElementClicked] = useState('')
    
    

    const dropRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<any>(null);


    const handleElementMenu = (e: React.MouseEvent, itemId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuType('element')
        setContextItemId(itemId);
        setRightElementClicked(itemId)
        setMenuPosition({ x: e.clientX, y: e.clientY });
    };

    const handleCanvasMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextItemId(null)
        setMenuType('droparea')
        setMenuPosition({ x: e.clientX, y: e.clientY });
    };

    const handleDeleteItem = () => {
        if (contextItemId) {
            setItemsInCanvas(prev => prev.filter(item => item.id !== contextItemId));
        }
        setContextItemId(null);
        setMenuPosition(null);
    };


    const handleDragStart = (event: DragStartEvent) => {
        const fromToolbox = initialItems.find(item => item.id === event.active.id);

        if (fromToolbox) {
            setActiveType(fromToolbox.id);
        } else {
            const existing = itemsInCanvas.find(item => item.id === event.active.id);
            if (existing) {
                setActiveType(existing.type);
            }
        }
    };




    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over, delta } = event;

        if (!over || over.id !== 'dropzone') {
            setActiveType(null);
            return;
        }

        const isToolboxItem = initialItems.some((item) => item.id === active.id);
        const clientEvent = event.activatorEvent as PointerEvent;

        if (!clientEvent || !dropRef.current) return;

        const dropBounds = dropRef.current.getBoundingClientRect();

        const x = delta.x + clientEvent.clientX - dropBounds.left;
        const y = delta.y + clientEvent.clientY - dropBounds.top;

        if (isToolboxItem) {
            const newItem: ItemData = {
                id: `${active.id}-${Date.now()}`,
                type: active.id,
                x,
                y
            };
            setItemsInCanvas(prev => [...prev, newItem]);
        } else {
            setItemsInCanvas(prev =>
                prev.map(item =>
                    item.id === active.id
                        ? {
                            ...item,
                            x: item.x + delta.x,
                            y: item.y + delta.y,
                        }
                        : item
                )
            );
        }
        setActiveType(null);
    };

    const handleClearCanvas = () => {
        setItemsInCanvas([])
        setMenuPosition(null);
        setMenuType(null);
    }


    const cleanMenu = () => {
        setMenuPosition(null)
        setRightElementClicked('')
    }

    useEffect(() => {
        const close = () => {
            setContextItemId(null);
            setMenuPosition(null);
            setRightElementClicked('')
        };
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, [menuPosition]);

    useEffect(() => {
        if (menuRef.current && menuPosition) {
            menuRef.current.style.setProperty('--menu-x', `${menuPosition.x}px`);
            menuRef.current.style.setProperty('--menu-y', `${menuPosition.y}px`);
        }
    }, [menuPosition]);

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div style={{display: 'flex', justifyContent: 'start', gap: '10px'}}>
            <button onClick={handleClearCanvas}>Clear Editor</button>
            <button onClick={() => setDragEnabled((prev) => !prev)}>
                {dragEnabled ? 'Lock Canvas' : 'Unlock Canvas'}
            </button>
            </div>
            <div className='xxx' style={{ display: 'flex', height: '100vh' }}>
                <Sidebar items={initialItems} cleanMenu={cleanMenu}/>
                <div  style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1, padding: '16px', justifyContent: 'space-between' }}>
                    <DropArea ref={dropRef} onContextMenu={(e: any) => handleCanvasMenu(e)}>
                        {itemsInCanvas.map((item) => (
                            <DraggableItem
                                key={item.id}
                                id={item.id}
                                type={item.type}
                                x={item.x}
                                y={item.y}
                                onContextMenu={(e) => handleElementMenu(e, item.id)}
                                dragEnabled={dragEnabled}
                                rightClicked={item.id === rightElementClicked}
                            />
                        ))}
                    </DropArea>
                    <Viewer viewerItems={itemsInCanvas}></Viewer>

                </div>

            </div>
            <DragOverlay>
                {activeType ? <DragOverlayWrapper type={activeType} /> : null}
            </DragOverlay>
            {menuPosition && (
                <div className='menu'
                    ref={menuRef}
                >
                    <button className='close-button'
                        onClick={() => {
                            setMenuPosition(null);
                            setMenuType(null);
                        }}
                    >
                        ×
                    </button>

                    {/* Menu Options */}
                    {menuType === 'element' && (
                        <div
                            className='menu-button'
                            onClick={() => {
                                handleDeleteItem()
                            }}
                        >
                            Delete
                        </div>
                    )}
                    {menuType === 'droparea' && (
                        <div
                            className='menu-button'
                            onClick={() => {
                                handleClearCanvas();
                            }}
                        >
                            Clear Canvas
                        </div>
                    )}
                </div>
            )}
        </DndContext>
    );
}





