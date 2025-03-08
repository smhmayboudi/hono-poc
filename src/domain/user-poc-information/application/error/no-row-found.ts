export class ErrorUserNotFound extends Error {
  constructor() {
    super("User not found");
    this.name = "ErrorUserNotFound";
  }
}
