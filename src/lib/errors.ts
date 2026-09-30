export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class DuplicateError extends AppError {
  constructor(field: string) {
    super(`Ya existe un registro con ese ${field}`, "DUPLICATE");
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string) {
    super(`${entity} no encontrado`, "NOT_FOUND");
  }
}
