import InformationHover from 'atoms/InformationHover';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';

interface Props {
  label: string;
  inputText: string | number;
  informationText: string;
}

const InfoTextField: React.FC<Props> = ({ label, inputText, informationText }) => {
  return (
    <FormControl className="w-56">
      <InputLabel shrink>
        <div className="flex items-center bg-white py-0.5 px-1">
          <span> {label} </span>
          <div className="ml-2 bg-transparent">
            <InformationHover information={informationText} />
          </div>
        </div>
      </InputLabel>

      <TextField
        id="outlined-required"
        label=""
        value={inputText}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          readOnly: true,
          tabIndex: -1, // Prevent focus
          style: { pointerEvents: 'none' }, // Prevent mouse interactions
        }}
      />
    </FormControl>
  );
};

export default InfoTextField;
