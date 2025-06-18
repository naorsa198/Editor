import { useEffect, useRef, useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
} from '@dnd-kit/core';
import DraggableItem from '../DraggableItem/DraggableItem';
import Sidebar from '../Sidebar/Sidebar';
import DropArea from '../DropArea';
import DragOverlayWrapper from '../DragOverlayWrapper/DragOverlayWrapper';
import './Editor.css'
import Viewer from '../Viewer';

// Each toolbox item has an id and a label
const initialItems = [
    { id: 'text', label: 'Text', text: 'Sample Text' },
    // { id: 'input', label: 'Input' },
    { id: 'button', label: 'Button' },
    { id: 'image', label: 'Image', src: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" }
];

type ElementType = 'text' | 'button' | 'image' | 'input';

type ItemData = {
    id: string;
    type: any;
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
    src?: string;
};

const elementTypes: ElementType[] = ['text', 'button', 'image', 'input'];


export default function Editor() {
    const [activeType, setActiveType] = useState<string | any>(null);
    const [activeItem, setActiveItem] = useState<{ id: string, text?: string, src?: string } | null>(null);
    const [contextItemId, setContextItemId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [menuType, setMenuType] = useState<ElementType | 'droparea' | null>(null);
    const [dragEnabled, setDragEnabled] = useState(true);
    const [rightElementClicked, setRightElementClicked] = useState('')
    const [selectionRect, setSelectionRect] = useState<{ startX: number, startY: number, endX: number, endY: number } | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [itemsInCanvas, setItemsInCanvas] = useState<ItemData[]>(() => {
        const saved = localStorage.getItem('canvas-items');
        return saved ? JSON.parse(saved) : [];
    });
    const [onFocusElement, setOnFocusElement] = useState<string | null>(null); // element Id that is currently focused
    const dropRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    function isElementType(value: any): value is ElementType {
        return elementTypes.includes(value);
    }

    const handleTextChange = (id: string, text: string) => {
        setItemsInCanvas(prev =>
            prev.map(item =>
                item.id === id ? { ...item, text } : item
            )
        );
    };

    const handleImageChange = (id: string, src: string) => {

        setItemsInCanvas(prev =>
            prev.map(item =>
                item.id === id ? { ...item, src } : item
            )
        );
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only start selection if clicking on empty canvas (not on an item)
        if (e.target === dropRef.current) {
            const rect = dropRef.current!.getBoundingClientRect();
            setSelectionRect({
                startX: e.clientX - rect.left,
                startY: e.clientY - rect.top,
                endX: e.clientX - rect.left,
                endY: e.clientY - rect.top,
            });
            setSelectedIds([]);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (selectionRect && dropRef.current) {
            const rect = dropRef.current.getBoundingClientRect();
            setSelectionRect({
                ...selectionRect,
                endX: e.clientX - rect.left,
                endY: e.clientY - rect.top,
            });
        }
    };

    const handleMouseUp = () => {
        if (selectionRect && dropRef.current) {
            const { startX, startY, endX, endY } = selectionRect;
            const x1 = Math.min(startX, endX);
            const y1 = Math.min(startY, endY);
            const x2 = Math.max(startX, endX);
            const y2 = Math.max(startY, endY);

            // Select items inside the rectangle
            const selected = itemsInCanvas
                .filter(item =>
                    item.x >= x1 &&
                    item.x <= x2 &&
                    item.y >= y1 &&
                    item.y <= y2
                )
                .map(item => item.id);

            setSelectedIds(selected);
            setSelectionRect(null);
        }
    };

    const handleElementMenu = (e: React.MouseEvent, itemId: string) => {
        e.preventDefault();
        e.stopPropagation();
        const itemType: ElementType = itemId.split('-')[0] as ElementType;
        if (!selectedIds.includes(itemId)) {
            setSelectedIds([itemId]);
        }
        setMenuType(itemType)
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

    const handleDeleteSelected = () => {
        setItemsInCanvas(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
        setContextItemId(null);
        setMenuPosition(null);
    };


    const handleDragStart = (event: DragStartEvent) => {
        const id = String(event.active.id); // Ensure string

        const fromToolbox = initialItems.find(item => item.id === id);

        if (fromToolbox) {
            setActiveType(fromToolbox.id);
        } else {
            const existing = itemsInCanvas.find(item => item.id === id);
            if (existing) {
                setActiveType(existing.type);
                setActiveItem({ id: id, text: existing.text, src: existing.src });
            }
        }
    };


    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const activeId = String(active.id);

        if (!over || over.id !== 'droparea') {
            setActiveType(null);
            return;
        }

        const isToolboxItem = initialItems.some((item) => item.id === active.id);
        const clientEvent = event.activatorEvent as PointerEvent;

        if (!clientEvent || !dropRef.current) return;

        const dropBounds = dropRef.current.getBoundingClientRect();

        // Get the dragged element's rect (relative to viewport)
        let rectObj = active.rect.current as any;
        if ('translated' in rectObj && rectObj.translated) {
            rectObj = rectObj.translated;
        }
        const elementWidth = rectObj.width;
        const elementHeight = rectObj.height;

        // Calculate the offset between pointer and element's top-left corner
        const pointerToTopLeftX = clientEvent.clientX - (rectObj.left ?? 0);
        const pointerToTopLeftY = clientEvent.clientY - (rectObj.top ?? 0);

        // The new position should be pointer position minus that offset, relative to the draoparea
        let x = clientEvent.clientX - dropBounds.left - pointerToTopLeftX;
        let y = clientEvent.clientY - dropBounds.top - pointerToTopLeftY;

        // Clamp so the entire element stays inside the dropdrea
        const minX = 0;
        const minY = 0;
        const maxX = dropBounds.width - elementWidth;
        const maxY = dropBounds.height - elementHeight;

        x = Math.max(minX, Math.min(x, maxX));
        y = Math.max(minY, Math.min(y, maxY));

        if (isToolboxItem) {
            const newItem: ItemData = {
                id: `${active.id}-${Date.now()}`,
                type: active.id,
                width: elementWidth,
                height: elementHeight,
                x,
                y,
            };
            setItemsInCanvas(prev => [...prev, newItem]);
        } else {
            // Calculate delta between old and new position of the dragged item
            const draggedItem = itemsInCanvas.find(item => item.id === activeId);
            if (!draggedItem) return;
            const dx = x - draggedItem.x;
            const dy = y - draggedItem.y;

            if (selectedIds.includes(activeId)) {
                setItemsInCanvas(prev =>
                    prev.map(item => {
                        if (selectedIds.includes(item.id)) {
                            // Use item width/height if available, else fallback to dragged element's size
                            const itemWidth = item.width ?? elementWidth;
                            const itemHeight = item.height ?? elementHeight;
                            const minX = 0;
                            const minY = 0;
                            const maxX = dropBounds.width - itemWidth;
                            const maxY = dropBounds.height - itemHeight;
                            const newX = Math.max(minX, Math.min(item.x + dx, maxX));
                            const newY = Math.max(minY, Math.min(item.y + dy, maxY));
                            return { ...item, x: newX, y: newY };
                        }
                        return item;
                    })
                );
            } else {
                setItemsInCanvas(prev =>
                    prev.map(item =>
                        item.id === activeId
                            ? { ...item, x, y }
                            : item
                    )
                );
            }
        }
        setActiveType(null);
        setActiveItem(null);
    };


    const handleClearCanvas = () => {
        if (!dragEnabled) {
            return;
        }
        setItemsInCanvas([])
        setMenuPosition(null);
        setMenuType(null);
    }


    const cleanMenu = () => {
        setMenuPosition(null)
        setRightElementClicked('')
    }

    const handleDownloadJSON = () => {
        const name = prompt("Enter file name:", "canvas-items.json");
        if (!name) return;
        const dataStr = JSON.stringify(itemsInCanvas, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name.endsWith('.json') ? name : name + '.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleLoadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                const data = JSON.parse(evt.target?.result as string);
                if (Array.isArray(data)) {
                    setItemsInCanvas(data);
                } else {
                    alert("Invalid JSON format.");
                }
            } catch {
                alert("Failed to parse JSON.");
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

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

    useEffect(() => {
        localStorage.setItem('canvas-items', JSON.stringify(itemsInCanvas));
    }, [itemsInCanvas]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                setSelectedIds(itemsInCanvas.map(item => item.id));
                return;
            }
            const tag = (e.target as HTMLElement).tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) {
                return;
            }
            if ((e.key === "Delete" || e.key === "Backspace")) {
                if (selectedIds.length > 0) {
                    setItemsInCanvas(prev =>
                        prev.filter(item => !selectedIds.includes(item.id))
                    );
                    setSelectedIds([]);
                }
                if (activeItem) {
                    setItemsInCanvas(prev =>
                        prev.filter(item => item.id !== onFocusElement)
                    );
                    setActiveItem(null);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIds, onFocusElement]);

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="editor-main">
                <Sidebar
                    items={initialItems}
                    cleanMenu={cleanMenu}
                    onClick={() => setSelectedIds([])}
                    onClearCanvas={handleClearCanvas}
                    onToggleDrag={() => setDragEnabled((prev) => !prev)}
                    dragEnabled={dragEnabled}
                    onDownloadJSON={handleDownloadJSON}
                    fileInputRef={fileInputRef}
                    onLoadJSON={handleLoadJSON}
                />
                <div className="editor-content">
                    <DropArea
                        ref={dropRef}
                        onContextMenu={(e: any) => handleCanvasMenu(e)}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    >
                        {itemsInCanvas.map((item) => (
                            <DraggableItem
                                key={item.id}
                                id={item.id}
                                type={item.type}
                                x={item.x}
                                y={item.y}
                                data={item}
                                dragEnabled={dragEnabled}
                                rightClicked={item.id === rightElementClicked}
                                selected={selectedIds.includes(item.id) || item.id === onFocusElement}
                                onContextMenu={(e) => handleElementMenu(e, item.id)}
                                onTextChange={handleTextChange}
                                onImageChange={handleImageChange}
                                onFocus={(id) => {
                                    setOnFocusElement(id);
                                }}
                            />
                        ))}
                        {/* Selection rectangle visual */}
                        {selectionRect && (
                            <div
                                className="selection-rectangle"
                                style={{
                                    left: Math.min(selectionRect.startX, selectionRect.endX),
                                    top: Math.min(selectionRect.startY, selectionRect.endY),
                                    width: Math.abs(selectionRect.endX - selectionRect.startX),
                                    height: Math.abs(selectionRect.endY - selectionRect.startY),
                                }}
                            />
                        )}
                    </DropArea>
                    <Viewer viewerItems={itemsInCanvas}></Viewer>
                </div>
            </div>
            <DragOverlay>
                {activeType ? <DragOverlayWrapper type={activeType} data={activeItem} /> : null}
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

                    {isElementType(menuType) && (
                        <>
                            {selectedIds.length > 1 ? (
                                <div
                                    className='menu-button'
                                    onClick={handleDeleteSelected}
                                >
                                    Delete Selected ({selectedIds.length})
                                </div>
                            ) : (

                                <div>
                                    <div
                                        className='menu-button'
                                        onClick={handleDeleteItem}
                                    >
                                        Delete
                                    </div>
                                    {(menuType === 'button') &&
                                        <div
                                            className='menu-button'
                                            onClick={() => alert('Button clicked!')}
                                        >
                                            Action
                                        </div>}
                                </div>
                            )}
                        </>
                    )}

                    {(menuType === 'droparea') && (
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





