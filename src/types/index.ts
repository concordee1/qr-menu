// src/types/index.ts

export type Category = {
  _id: string;
  name: string;
  parent?: { _id: string; name: string } | null; // Parent can be an object or null
  imageUrl: string;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  // Category can be either a string (ID) or a populated Category object
  category: string | { 
    _id: string;
    name: string;
  };
};
