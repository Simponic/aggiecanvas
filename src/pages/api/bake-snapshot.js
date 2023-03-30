import { prisma } from "../../../utils/db-client";

const BAKE_INTERVAL_MS = 20 * 60 * 1000;

const bake = async () => {
  const oldGrid = (
    await prisma.gridSnapshot.findFirst({
      orderBy: { lastUpdate: "desc" },
    })
  ).grid;

  const updates = await prisma.update.findMany({
    where: { timeStamp: { lt: new Date() } },
  });

  for (let u of updates) {
    oldGrid[u.row][u.column] = u.color;
  }

  await prisma.gridSnapshot.create({
    data: { grid: oldGrid },
  });

  await prisma.update.deleteMany({});
}

export default async (req, res) => {
  if (req.connection.remoteAddress != "129.123.254.123") {
    res.status(401).json({ message: "You are not authorized to do that" });
    return;
  }

  await bake();

  res.status(200).json({});
};

setInterval(bake, BAKE_INTERVAL_MS);
