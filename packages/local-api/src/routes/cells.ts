import express from "express";
import fs from "fs/promises";
import path from "path";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    // read file and inspect error if error exists

    try {
      const result = await fs.readFile(fullPath, {
        encoding: "utf-8",
      });
      res.send(JSON.parse(result));
    } catch (err) {
      if (err.code === "ENOENT") {
        await fs.writeFile(fullPath, "[]", "utf-8");
        res.send([]);
      } else {
        throw err;
      }
    }
  });

  router.post("/cells", async (req, res) => {
    // take list from req obj
    // serialize them

    const { cells }: { cells: Cell[] } = req.body;

    // write cells into file
    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

    res.send({ status: "ok" });
  });

  return router;
};
