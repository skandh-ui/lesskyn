//by default, errors.ts contains custom error classes for handling specific error scenarios in the application.
//this wont be counted as a normal error like when we throw new Error("Some error"), these are custom errors for specific scenarios

export class SlotAlreadyBookedError extends Error {
  constructor(message = "Time slot already booked") {
    super(message);
    this.name = "SlotAlreadyBookedError";
  }
}
