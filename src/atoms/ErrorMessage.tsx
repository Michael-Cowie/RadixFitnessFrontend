import { FormHelperText } from '@mui/material';

interface Props {
  errorMessage: string | undefined;
}

const ErrorMessage: React.FC<Props> = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return (
    <FormHelperText error style={{ marginTop: '0px', marginLeft: '0' }}>
      {errorMessage}
    </FormHelperText>
  );
};

export default ErrorMessage;
