export class ErrorNoRowsAffected extends Error {
  constructor() {
    super("No rows affected");
    this.name = "ErrorNoRowsAffected";
  }
}
