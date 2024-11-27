import app from './app';

const PORT = 8080;

const server = app.listen(PORT, () => console.log(`Server is rurring on Port: ${PORT}`))

export default server;
