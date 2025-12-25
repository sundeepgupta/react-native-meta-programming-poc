export type ProductID = string;

export type Product = {
  id: ProductID;
  name: string;
  price: number;
};

export function createProduct(id: ProductID, name: string, price: number): Product {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Product name must not be empty");
  }
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Product price must be a non-negative");
  }

  return { id, name: trimmedName, price};
}