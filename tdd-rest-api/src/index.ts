import express, { Application } from "express";
import { UserRouter } from "./routers/user.router";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());

const userRouter = new UserRouter();

app.use("/api/users", userRouter.getRouter());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api`);
});

export default app;
