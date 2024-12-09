import { prismaMock } from "../setup_test/singleton";
import { getUser } from "../setup_test/function";

test("Should return an array of users", async () => {
  const sampleUsers = [
    {
      id: 1,
      firstName: "Andi",
      lastName: "Suhendi",
      email: "andisuhendi@email.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      firstName: "Budi",
      lastName: "Rahadi",
      email: "budirahadi@email.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  prismaMock.user.findMany.mockResolvedValue(sampleUsers);

  await expect(getUser()).resolves.toEqual(sampleUsers);
});
