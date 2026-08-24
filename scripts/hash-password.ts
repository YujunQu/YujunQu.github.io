import { hashPassword } from "../lib/auth";

async function main() {
  const password = process.argv[2];

  if (!password) {
    console.error("Usage: npm run hash-password -- <plain-password>");
    process.exit(1);
  }

  const hash = await hashPassword(password);
  console.log(hash);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
