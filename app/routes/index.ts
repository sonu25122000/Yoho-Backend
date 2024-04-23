import express from "express";
import superAdmin from "./superAdmin";
import recruiter from "./recruiter";
const app = express();

app.use("/superAdmin", superAdmin);
app.use("/recruiter", recruiter);

export default app;
