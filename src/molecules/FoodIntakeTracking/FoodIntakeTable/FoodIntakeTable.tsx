import AddEntry from 'atoms/addEntry';
import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import DesktopTable from './DesktopTable';
import { pageSize } from './interfaces';
import MobileTable from './MobileTable';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';
import AddFoodEntryModal from '../CreateFoodEntry/AddFoodEntryModal';

export default function FoodIntakeTable() {
  const [createFoodEntry, setCreateFoodEntry] = useState<boolean>(false);
  const [currentUserTablePage, setCurrentUserTablePage] = useState(0);

  const { foodEntries, selectedDate } = useFoodIntakeTrackingContext();

  useEffect(() => {
    setCurrentUserTablePage(0);
  }, [selectedDate]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(foodEntries.length / pageSize) - 1);
    setCurrentUserTablePage(Math.min(currentUserTablePage, maxPage));
  }, [foodEntries.length, currentUserTablePage]);

  const paginatedEntries = foodEntries.slice(
    currentUserTablePage * pageSize,
    currentUserTablePage * pageSize + pageSize,
  );
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="h-6 w-6 ml-3">
          <AddEntry onClick={() => setCreateFoodEntry(true)} />
        </div>

        <TablePagination
          component="div"
          rowsPerPage={pageSize}
          page={currentUserTablePage}
          count={foodEntries.length}
          onPageChange={(_, newPage: number) => setCurrentUserTablePage(newPage)}
          rowsPerPageOptions={[]}
          sx={{
            borderBottom: 0,

            // All arrow icons (left and right)
            '.MuiTablePagination-actions': {
              color: 'primary.main',
            },

            // Handle disabled arrow buttons (so they don't look greyed out)
            '.MuiTablePagination-actions .MuiIconButton-root:disabled': {
              color: 'primary.main',
              opacity: 0.5, // Optional: make it semi-transparent
            },
          }}
        />
      </div>

      <div className="block sm:hidden">
        <MobileTable entries={paginatedEntries} />
      </div>

      <div className="hidden sm:block">
        <DesktopTable entries={paginatedEntries} />
      </div>

      {createFoodEntry && <AddFoodEntryModal closeModalWindow={() => setCreateFoodEntry(false)} />}
    </Box>
  );
}
