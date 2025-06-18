// Sidebar.tsx
import ToolboxItem from '../ToolboxItem/ToolboxItem';
import './Sidebar.css';
import { RefObject } from 'react';

export type SidebarProps = {
  items: { id: string, label: string }[];
  cleanMenu: any
  onClick: () => void;
  onClearCanvas: () => void;
  onToggleDrag: () => void;
  dragEnabled: boolean;
  onDownloadJSON: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onLoadJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Sidebar({ items,
  cleanMenu,
  onClick,
  onClearCanvas,
  onToggleDrag,
  dragEnabled,
  onDownloadJSON,
  fileInputRef,
  onLoadJSON, }: SidebarProps) {
  return (
    <div
      className="sidebar"
      onMouseEnter={() => {
        cleanMenu()
        onClick()
      }}
    >
      <div className='sidebar-elements'>
        {items.map((item) => (
          <ToolboxItem key={item.id} id={item.id} />
        ))}
      </div>
      
      <div className="sidebar-toolbar-buttons">
        <button onClick={onClearCanvas}>Clear Editor</button>
        <button onClick={onToggleDrag}>
          {dragEnabled ? 'Lock Editor' : 'Unlock Editor'}
        </button>
        <button onClick={onDownloadJSON}>Export Layout</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={onLoadJSON}
        />
        <button onClick={() => fileInputRef.current?.click()}>
          Import Layout
        </button>
      </div>
    </div>
  );
}
