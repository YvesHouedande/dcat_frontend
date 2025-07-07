import { describe, it, expect } from "vitest";
import { omit } from "../lib/utils"; // adapte aussi ce chemin

describe("omit", () => {
  it("devrait omettre les clés spécifiées", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj, ["b", "c"]);
    expect(result).toEqual({ a: 1 });
  });

  it("devrait retourner une copie intacte si aucune clé ne correspond", () => {
   const obj = { x: 10 };
    const result = omit(obj, ["y" as keyof typeof obj]); // on force gentiment
    expect(result).toEqual({ x: 10 });
  });

  it("devrait fonctionner avec un objet vide", () => {
    const result = omit({} as Record<string, unknown>, ["a"]);
    expect(result).toEqual({});
  });
});
