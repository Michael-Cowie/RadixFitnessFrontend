import AddEntry from 'atoms/addEntry';
import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import FoodIntakeDesktopTable from './FoodIntakeDesktopTable';
import { pageSize } from './FoodIntakeinterfaces';
import FoodIntakeMobileTable from './FoodIntakeMobileTable';
import useFoodIntakeTrackingContext from 'context/FoodIntakeTracking/hooks';
import AddFoodEntryModal from '../CreateFoodEntry/AddFoodEntryModal';
import { assertDayView } from 'context/FoodIntakeTracking/FoodIntakeTrackingUtils';
import useProfileContext from 'context/ProfileContext/hooks';
import { userMeasureSystemToFoodUnit } from 'lib/foodTranslations';

export default function FoodIntakeTable() {
  const [createFoodEntry, setCreateFoodEntry] = useState<boolean>(false);
  const [currentUserTablePage, setCurrentUserTablePage] = useState(0);

  const { foodEntries, selectedView } = useFoodIntakeTrackingContext();
  const { measurementSystem } = useProfileContext();

  const foodMassUnit = userMeasureSystemToFoodUnit(measurementSystem);

  assertDayView(selectedView);

  useEffect(() => {
    setCurrentUserTablePage(0);
  }, [selectedView.day]);

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

            '.MuiTablePagination-actions': {
              color: 'primary.main',
            },

            '.MuiTablePagination-actions .MuiIconButton-root:disabled': {
              color: 'primary.main',
              opacity: 0.5, // Optional: make it semi-transparent
            },
          }}
        />
      </div>

      <div className="block sm:hidden">
        <FoodIntakeMobileTable entries={paginatedEntries} foodMassUnit={foodMassUnit} />
      </div>

      <div className="hidden sm:block">
        <FoodIntakeDesktopTable entries={paginatedEntries} foodMassUnit={foodMassUnit} />
      </div>

      {createFoodEntry && <AddFoodEntryModal closeModalWindow={() => setCreateFoodEntry(false)} />}
    </Box>
  );
}
