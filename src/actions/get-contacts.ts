"use server";

import { prisma } from "@/lib/prisma";

export async function getContacts() {
  try {
    const contacts = await prisma.contact.findMany();
    return { success: true, data: contacts };
  } catch {
    return { success: false, data: null };
  }
}
