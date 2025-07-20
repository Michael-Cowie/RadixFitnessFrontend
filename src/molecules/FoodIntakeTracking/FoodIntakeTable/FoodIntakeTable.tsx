import AddEntry from 'atoms/addEntry';
import React, { useState } from 'react';

import { Box } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';

import CreateFoodEntry from '../CreateFoodEntry/CreateFoodEntry';
import DesktopTable from './DesktopTable';
import { pageSize } from './interfaces';
import MobileTable from './MobileTable';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';

export default function FoodIntakeTable() {
  const [createFoodEntry, setCreateFoodEntry] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    entryId: number;
    foodName: string;
  } | null>(null);

  const { foodEntries, deleteFoodEntryWithID } = useFoodIntakeTrackingContext();

  const handleContextMenu = (event: React.MouseEvent, entryId: number, foodName: string) => {
    event.preventDefault();

    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
      entryId: entryId,
      foodName: foodName,
    });
  };

  const handleDeleteRow = () => {
    if (contextMenu) {
      deleteFoodEntryWithID(contextMenu.entryId);
    }
    setContextMenu(null);
  };

  const paginatedEntries = foodEntries.slice(page * pageSize, page * pageSize + pageSize);
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <div className="block sm:hidden">
        <MobileTable entries={paginatedEntries} handleContextMenu={handleContextMenu} />
      </div>

      <div className="hidden sm:block">
        <DesktopTable entries={paginatedEntries} handleContextMenu={handleContextMenu} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="h-6 w-6 ml-3">
          <AddEntry onClick={() => setCreateFoodEntry(true)} />
        </div>

        {/* In order to prevent the pagination controls from scrolling, the TablePagination component is used outside of the Table. */}
        <TablePagination
          rowsPerPage={pageSize}
          page={page}
          count={foodEntries.length}
          onPageChange={(_, newPage: number) => setPage(newPage)}
          rowsPerPageOptions={[]}
        />
      </div>

      {/* 
        Right-click context menu. 

        When we anchor a context menu, its position is stuck. We cannot change
        this position. Therefore, to move the menu we need to change the key.
        This tells React to unmount the current Menu component and mount
        an entirely new one in its new anchor position.

        When we right click a row, it will set the context menu state by
        calling onContextMenu connected to the table row. When we right click 
        elsewhere, onBlur will first be called which sets the key of the menu 
        to undefined. Afterwards onContextMenu will be called again which sets 
        the key to the row id. This allows for multiple clicks on the same row.
      */}
      <Menu
        key={contextMenu?.entryId}
        open={contextMenu !== null}
        onBlur={() => setContextMenu(null)}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
        }
      >
        <MenuItem onClick={handleDeleteRow}> Delete {contextMenu?.foodName}</MenuItem>
      </Menu>

      {createFoodEntry && <CreateFoodEntry closeModalWindow={() => setCreateFoodEntry(false)} />}
    </Box>
  );
}
