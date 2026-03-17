"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { OperatorLocation } from "../../generated/prisma/enums";

function sanitizeContent(str: string, maxLength: number = 2000): string {
  if (!str) return "";
  return str
    .slice(0, maxLength)
    .replace(/(?:javascript|data|vbscript|file):/gi, "")
    .replace(/[<>'"&\\]/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

const locationMap: Record<string, OperatorLocation> = {
  SBCZ: OperatorLocation.SBCZ,
  SBTF: OperatorLocation.SBTF,
  SBAT: OperatorLocation.SBAT,
  SBHT: OperatorLocation.SBHT,
  SBCJ: OperatorLocation.SBCJ,
  SBIH: OperatorLocation.SBIH,
  SBMA: OperatorLocation.SBMA,
  SBTB: OperatorLocation.SBTB,
  SBJI: OperatorLocation.SBJI,
  SBUY: OperatorLocation.SBUY,
  SBRD: OperatorLocation.SBRD,
  SBSO: OperatorLocation.SBSO,
  SBSI: OperatorLocation.SBSI,
  SSKW: OperatorLocation.SSKW,
  SWGN: OperatorLocation.SWGN,
};

const updateContact = async (data: { location: string; content: string }) => {
  const authResult = await requireAuth("OPERATOR");

  if (!authResult.authorized) {
    return {
      success: false,
      error: authResult.error || "Acesso não autorizado",
    };
  }

  const enumLocation = locationMap[data.location];
  if (!enumLocation) {
    return { success: false, error: "Localidade inválida" };
  }

  const content = sanitizeContent(data.content);

  console.info(
    `[AUDIT] Usuário ${authResult.user?.email} atualizando contato: ${data.location}`,
  );

  try {
    const contact = await prisma.contact.upsert({
      where: { location: enumLocation },
      create: { location: enumLocation, content },
      update: { content },
    });

    return { success: true, data: contact };
  } catch (error) {
    console.error("Erro ao atualizar contato:", error);
    return { success: false, error: "Erro ao salvar contato" };
  }
};

export default updateContact;
