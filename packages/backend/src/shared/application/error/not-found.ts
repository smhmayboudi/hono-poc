export class ErrorNotFound extends Error {
  constructor() {
    super("Not found");
    this.name = "ErrorNotFound";
  }
}
