import { auth } from "@/auth";

type Role = "Admin" | "Seller";

export class UnauthorizedError extends Error {
  constructor(message = "No autorizado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    throw new UnauthorizedError("Debes iniciar sesión");
  }

  return session;
}

export async function requireRole(allowedRoles: Role | Role[]) {
  const session = await requireAuth();

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(session.user.role as Role)) {
    throw new UnauthorizedError("No tienes permisos para esta acción");
  }

  return session;
}
