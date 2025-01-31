import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import v1Routes from "./routes/v1/index";
import connectDB from "./db/db";
import helmet from "helmet";

dotenv.config();

connectDB();

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", v1Routes);

const args = process.argv.slice(2);
const portArgIndex = args.indexOf("--port");
const PORT =
  portArgIndex !== -1
    ? Number(args[portArgIndex + 1])
    : Number(process.env.PORT) || 8000;

app.listen(PORT, () => {
  console.log("The server is listening to the port 3000");
});
