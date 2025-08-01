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
  const [page, setPage] = useState(0);

  const { foodEntries, selectedDate } = useFoodIntakeTrackingContext();

  useEffect(() => {
    setPage(0);
  }, [selectedDate]);

  const paginatedEntries = foodEntries.slice(page * pageSize, page * pageSize + pageSize);
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="h-6 w-6 ml-3">
          <AddEntry onClick={() => setCreateFoodEntry(true)} />
        </div>

        <TablePagination
          component="div"
          rowsPerPage={pageSize}
          page={page}
          count={foodEntries.length}
          onPageChange={(_, newPage: number) => setPage(newPage)}
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
