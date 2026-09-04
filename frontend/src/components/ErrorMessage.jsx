import Alert from './ui/Alert.jsx';

const ErrorMessage = ({ message }) => (message ? <Alert variant="error">{message}</Alert> : null);

export default ErrorMessage;
