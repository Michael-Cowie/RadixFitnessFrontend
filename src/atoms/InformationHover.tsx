import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

interface Props {
  information: string;
}

const InformationHover: React.FC<Props> = ({ information }) => {
  return (
    <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{information}</span>}>
      <IconButton size="small" sx={{ padding: 0 }}>
        <InfoOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default InformationHover;
