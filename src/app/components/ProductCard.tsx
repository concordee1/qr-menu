// src/components/ProductCard.tsx
type ProductCardProps = {
  productName: string;
  description: string;
  price: number;
  imageUrl: string; 
};


export default function ProductCard({ productName, description, price, imageUrl }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-lg w-72 m-2 bg-white">
      {/* Resim Alanı */}
      <div className="w-full h-40 bg-gray-200 rounded-md mb-4">
         {/* 3. Adım: Sabit resim yerine props'tan gelen imageUrl'i kullanacağız. 
             Ancak şimdilik resmi göstermiyoruz, sadece yer tutucumuz var. */}
      </div>

      {/* İçerik Alanı */}
      <div>
        {/* 4. Adım: Sabit yazıları, props'tan gelen dinamik verilerle değiştirdik.
            JSX içinde değişken kullanmak için süslü parantez {} kullanılır. */}
        <h2 className="text-xl font-bold text-gray-800">{productName}</h2>
        <p className="text-gray-600 mt-2 h-12">
          {description}
        </p>
        <div className="mt-4 text-right">
          <span className="text-2xl font-bold text-emerald-600">
            {price} TL
          </span>
        </div>
      </div>
    </div>
  );
}