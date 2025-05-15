export class ErrorNoRowFound extends Error {
  constructor() {
    super("No row found");
    this.name = "ErrorNoRowFound";
  }
}
