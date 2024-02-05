interface Props {
    errorMessage: string | undefined
}


const ErrorMessage: React.FC<Props> = ({ errorMessage }) => {
    const errorMessageStyle = {
        'color': 'red',
        'marginTop': '10px',
        'marginBottom': '10px',
        'fontFamily': 'sans-serif',

    }
	return (
        errorMessage ? <p style={ errorMessageStyle }> { errorMessage } </p> : <div/>
	);
};

export default ErrorMessage;