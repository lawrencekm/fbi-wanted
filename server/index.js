import dotenv from "dotenv";
dotenv.config();

import express from "express";
import apiRouter from "./routes/apiRouter.js";
import cors from "cors";


const PORT = process.env.PORT || 3001;
const app = express();

import rateLimit  from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // Limit each IP to 100 req
});

app.use(limiter);

// Enable CORS for all routes from react origin
app.use(cors({
  origin: [process.env['FRONTEND_DOMAIN'], process.env['FRONTEND_DOMAIN_TWO']], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
console.log('FRONTEND_DOMAIN', process.env['FRONTEND_DOMAIN']);
app.use("/", apiRouter);



//graceful errorhandling
app.use((err, req, res, next) => {
    console.error(err.stack);
    //send notification with encrypted non-personal request details to slack/email/other
    res.status(500).json({ error: "Something went wrong!" });
  });


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
