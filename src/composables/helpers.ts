export function capitalizeFirstLetter(word: string) {
  if (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  } else {
    return "Please provide valide string.";
  }
}
