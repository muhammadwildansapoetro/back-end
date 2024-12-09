import request from "supertest";
import app from "..";
import prisma from "../prisma";

describe("GET /api/users", () => {
  const sampleUsers = [
    {
      id: 1,
      firstName: "Andi",
      lastName: "Suhendi",
      email: "andisuhendi@email.com",
    },
    {
      id: 2,
      firstName: "Budi",
      lastName: "Rahadi",
      email: "budirahadi@email.com",
    },
  ];

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    const user = await prisma.user.findMany();
    if (user.length == 0) {
      await prisma.user.createMany({
        data: sampleUsers,
      });
    }
  });

  afterEach(async () => {
    await prisma.user.deleteMany({ where: {} });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Should return an array of users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: "OK",
      users: sampleUsers.map((user) => {
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };
      }),
    });
  });
});
