interface Props {
    errorMessage: string | undefined
}

const ErrorMessage: React.FC<Props> = ({ errorMessage }) => {
    const errorMessageStyle: React.CSSProperties = {
        color: 'red',
        marginTop: '10px',
        marginBottom: '10px',
        fontFamily: 'sans-serif',
        fontWeight: '600',
        textAlign: 'center',
    };

    return errorMessage ? (
        <p style={errorMessageStyle}>{errorMessage}</p>
    ) : null;
};

export default ErrorMessage;
