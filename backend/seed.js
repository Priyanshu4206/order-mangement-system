import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import os from "os";
import QRCode from "qrcode";

const prisma = new PrismaClient();

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

async function main() {
  // Seed admin user
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";
  const adminName = "Admin";
  const adminRole = "admin";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashed,
        role: adminRole,
      },
    });
    console.log("Admin user seeded.");
  } else {
    console.log("Admin user already exists.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: "tanmay@example.com" },
  });
  if (!existingUser) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: "Tanmay",
        email: "tanmay@example.com",
        password: hashed,
        role: "kitchen",
      },
    });
    console.log("Kitchen user seeded.");
  } else {
    console.log("Kitchen user already exists.");
  }

  // Ensure uploads directory exists
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  // Seed tables with QR codes
  const tableNumbers = [1, 2, 3, 4, 5];
  const localIp = getLocalIp();
  for (const number of tableNumbers) {
    const exists = await prisma.table.findUnique({ where: { number } });
    const qrFile = `uploads/table-${number}.png`;
    const url = `http://${localIp}:5173/table/${number}`;
    await QRCode.toFile(qrFile, url);
    if (!exists) {
      await prisma.table.create({ data: { number, qrCode: qrFile } });
      console.log(`Seeded table: ${number} with QR`);
    } else {
      // Optionally update QR code if not present
      if (!exists.qrCode) {
        await prisma.table.update({
          where: { id: exists.id },
          data: { qrCode: qrFile },
        });
        console.log(`Updated table: ${number} with QR`);
      } else {
        console.log(`Table already exists: ${number}`);
      }
    }
  }

  // Seed menu items
  const menuItems = [
    {
      name: "Pav Bhaji",
      description: "Spicy mashed vegetables served with buttered bread rolls",
      price: 5.0,
      available: true,
      imageUrl:
        "https://www.vegrecipesofindia.com/wp-content/uploads/2021/06/pav-bhaji-recipe-1.jpg",
    },
    {
      name: "Masala Dosa",
      description: "Crispy rice crepe filled with spiced potato masala",
      price: 6.5,
      available: true,
      imageUrl:
        "https://www.cookwithmanali.com/wp-content/uploads/2022/04/Masala-Dosa.jpg",
    },
    {
      name: "Cold Coffee",
      description: "Iced coffee with milk, sugar, and a scoop of ice cream",
      price: 3.5,
      available: true,
      imageUrl:
        "https://www.vegrecipesofindia.com/wp-content/uploads/2021/04/cold-coffee-recipe-1.jpg",
    },
    {
      name: "Chole Bhature",
      description: "Spicy chickpea curry served with deep-fried bread",
      price: 7.0,
      available: true,
      imageUrl:
        "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/chole-bhature-recipe.jpg",
    },
    {
      name: "Paneer Butter Masala",
      description: "Creamy tomato-based curry with soft paneer cubes",
      price: 8.0,
      available: true,
      imageUrl:
        "https://www.vegrecipesofindia.com/wp-content/uploads/2021/11/paneer-butter-masala-1.jpg",
    },
  ];

  for (const item of menuItems) {
    const exists = await prisma.menuItem.findFirst({
      where: { name: item.name },
    });
    if (!exists) {
      await prisma.menuItem.create({ data: item });
      console.log(`Seeded menu item: ${item.name}`);
    } else {
      console.log(`Menu item already exists: ${item.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
