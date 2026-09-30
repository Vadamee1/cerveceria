"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

const EMPLOYEE_ROLE_ID = "role-seller";
const EMPLOYEES_PATH = "/app/employees";

export type EmployeeRow = {
  id: string;
  username: string;
  isActive: boolean;
};

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getEmployees(): Promise<EmployeeRow[]> {
  return prisma.user.findMany({
    where: { role: { id: EMPLOYEE_ROLE_ID } },
    select: { id: true, username: true, isActive: true },
    orderBy: { username: "asc" },
  });
}

export type CreateEmployeeInput = {
  username: string;
  password: string;
};

export async function createEmployee(
  input: CreateEmployeeInput,
): Promise<ActionResult<EmployeeRow>> {
  const username = input.username.trim();

  if (!username) {
    return { success: false, error: "El usuario es requerido." };
  }
  if (!input.password || input.password.length < 6) {
    return {
      success: false,
      error: "La contraseña debe tener al menos 6 caracteres.",
    };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { success: false, error: "Ese nombre de usuario ya existe." };
  }

  const role = await prisma.role.findUnique({
    where: { id: EMPLOYEE_ROLE_ID },
  });
  if (!role) {
    return {
      success: false,
      error: "No se encontró el rol de vendedor en la base de datos.",
    };
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: { username, password: hashedPassword, roleId: role.id },
    select: { id: true, username: true, isActive: true },
  });

  revalidatePath(EMPLOYEES_PATH);
  return { success: true, data: user };
}

export type UpdateEmployeeInput = {
  id: string;
  username: string;
  password?: string;
};

export async function updateEmployee(
  input: UpdateEmployeeInput,
): Promise<ActionResult<EmployeeRow>> {
  const username = input.username.trim();

  if (!username) {
    return { success: false, error: "El usuario es requerido." };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing && existing.id !== input.id) {
    return { success: false, error: "Ese nombre de usuario ya existe." };
  }

  if (input.password && input.password.length < 6) {
    return {
      success: false,
      error: "La contraseña debe tener al menos 6 caracteres.",
    };
  }

  const data: { username: string; password?: string } = { username };
  if (input.password) {
    data.password = await bcrypt.hash(input.password, 10);
  }

  const user = await prisma.user.update({
    where: { id: input.id },
    data,
    select: { id: true, username: true, isActive: true },
  });

  revalidatePath(EMPLOYEES_PATH);
  return { success: true, data: user };
}

export async function setEmployeeStatus(
  id: string,
  isActive: boolean,
): Promise<ActionResult<EmployeeRow>> {
  const user = await prisma.user.update({
    where: { id },
    data: { isActive },
    select: { id: true, username: true, isActive: true },
  });

  revalidatePath(EMPLOYEES_PATH);
  return { success: true, data: user };
}
