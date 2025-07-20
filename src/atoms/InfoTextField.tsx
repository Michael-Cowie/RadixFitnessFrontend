import InformationHover from 'atoms/InformationHover';

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

interface Props {
  label: string;
  inputText: string | number;
  informationText?: string;
}

const InfoTextField: React.FC<Props> = ({ label, inputText, informationText }) => {
  return (
    <FormControl className="w-56">
      <TextField
        id={`${label}_readonly_textfield`}
        value={inputText}
        onChange={() => {}}
        label={
          <div className="flex items-center gap-1">
            {label}
            {informationText && <InformationHover information={informationText} />}
          </div>
        }
        InputLabelProps={{ shrink: true }}
        InputProps={{
          readOnly: true,
          tabIndex: -1,
          style: { pointerEvents: 'none' },
        }}
      />
    </FormControl>
  );
};

export default InfoTextField;
