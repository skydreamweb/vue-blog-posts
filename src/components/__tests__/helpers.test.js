import { describe, it, expect } from "vitest";
import { capitalizeFirstLetter } from "../../composables/helpers";

it("should start with capital letter", () => {
  // Arange
  const name = "This is username";
  // Act
  const result = capitalizeFirstLetter(name);
  // Assert
  expect(result[0]).toEqual(result[0].toUpperCase());
});

it("should ask for valid string if no argument is presented", () => {
  // Arange
  const name = "";
  // Act
  const result = capitalizeFirstLetter(name);
  // Assert
  expect(result).toMatch("Please provide valide string.");
});
