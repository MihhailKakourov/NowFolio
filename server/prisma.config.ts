/// <reference types="node" />
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
    // @ts-ignore - Prisma CLI supports directUrl in config, but types might be missing
    directUrl: process.env["DIRECT_URL"],
  },
});
