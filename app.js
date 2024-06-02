import express from "express";
import cors from "cors";
import patientRouter from "./routers/patient.js";
import doctorRouter from "./routers/doctor.js";
import visitorRouter from "./routers/visitor.js";
import admissionRouter from "./routers/admission.js";
import adminRouter from "./routers/admin.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api/patient", patientRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/visitor", visitorRouter);
app.use("/api/admission", admissionRouter);
app.use("/api/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
