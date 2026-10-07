import path from "node:path";

export function getDatabasePath() {
  return (
    process.env.DATABASE_PATH ||
    path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "bytex.db")
  );
}

export function getUploadDir() {
  return (
    process.env.UPLOAD_DIR ||
    path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "uploads")
  );
}

export function getDataRoot() {
  return path.dirname(getDatabasePath());
}
