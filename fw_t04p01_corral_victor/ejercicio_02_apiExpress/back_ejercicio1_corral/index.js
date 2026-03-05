require("dotenv").config();

const dns = require('dns'); 
dns.setServers(['192.168.1.1', '8.8.8.8'])

const connectDB = require("./src/config/db"); 
const app = require("./src/app");

connectDB(); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto http://localhost:${PORT}`);
});