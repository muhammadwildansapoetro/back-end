import request from "supertest";
import app from "..";
import prisma from "../prisma";
import nock from "nock";

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

describe("GET /api/pokemons", () => {
  it("Should return an array of pokemons", async () => {
    const mockResponse = {
      results: [
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
      ],
    };

    nock("https://pokeapi.co").get("/api/v2/pokemon").reply(200, mockResponse);
    const response = await request(app).get("/api/pokemons");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.results);
  });
});
