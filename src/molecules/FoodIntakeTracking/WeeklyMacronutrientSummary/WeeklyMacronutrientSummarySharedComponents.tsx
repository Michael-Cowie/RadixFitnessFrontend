import { Typography } from '@mui/material';
import { formatSummaryTitle } from './WeeklyMacronutrientSummaryUtils';

interface Props {
  numberOfDaysWithLogs: number;
}

export const SummaryTitle: React.FC<Props> = ({ numberOfDaysWithLogs }) => {
  return (
    <div className="flex justify-center">
      <Typography sx={{ fontWeight: 'bold', mt: 1 }}>
        {formatSummaryTitle(numberOfDaysWithLogs)}
      </Typography>
    </div>
  );
};
