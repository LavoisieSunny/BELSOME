import app from "./app";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` BELSOME Backend Server Running on Port: ${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/health`);
  console.log(`=============================================`);
});
