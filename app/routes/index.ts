import express from "express";
import superAdmin from "./superAdmin";
const app = express();

app.use("/superAdmin", superAdmin);
export default app;
