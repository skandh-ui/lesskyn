import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductData {
  name: string;
  pictureLink: string;
  amazon: {
    link: string;
    price: number;
  };
}

interface ProductCardProps {
  data: ProductData;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const MAX_NAME_LENGTH = 32; // "Hydrating Foaming Oil Cleanser" length
  const trimmedName =
    data.name.length > MAX_NAME_LENGTH
      ? data.name.substring(0, MAX_NAME_LENGTH) + "..."
      : data.name;

  // Default placeholder image if pictureLink is missing
  const imageUrl = data.pictureLink || "/placeholder-product.png";
  const amazonLink = data.amazon.link || "#";

  return (
    <div className="w-80 h-[410px] rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Product Image */}
      <div className="relative mb-6 flex h-48 w-full items-center justify-center bg-gray-50 rounded-lg">
        <Image
          src={imageUrl}
          alt={data.name}
          width={200}
          height={200}
          className="max-h-full w-auto object-contain"
          priority
        />
      </div>

      {/* Product Info */}
      <div className="mb-6 flex-grow">
        <h3 className="mb-1 text-xl font-medium text-gray-900 leading-snug">
          {trimmedName}
        </h3>
      </div>

      {/* Buy Now Button */}
      <Link
        href={amazonLink}
        target="_blank"
        className="flex w-full items-center justify-center rounded-lg bg-yellow-300 px-4 py-3 transition-all duration-200 hover:bg-yellow-400 hover:shadow-lg hover:scale-105 active:scale-95"
      >
        <span className="font-bold text-gray-900">Buy Now</span>
      </Link>
    </div>
  );
};

export default ProductCard;
