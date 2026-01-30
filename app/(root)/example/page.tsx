import DermatCard from "@/components/DermatCard";
import InfluencerCard from "@/components/InfluencerCard";
import ProductCard from "@/components/ProductCard";

export default function Page() {
  const productData = {
    step: 1,
    name: "Purifying Sulfur Cooling Mask",
    company: "O3+",
    pictureLink: "/images/your-product-image.png", // Or a URL
    amazon: {
      link: "https://amazon.com/...",
      price: 289,
    },
    flipkart: {
      link: "https://flipkart.com/...",
      price: 299,
    },
    nykaa: {
      link: "https://nykaa.com/...",
      price: 279,
    },
  };

  return (
    <div className="p-10 flex gap-4">
      <ProductCard data={productData} />
      <InfluencerCard variant="booked" date="2025-12-19" />
      <DermatCard variant="booked" date="2025-12-19" />
    </div>
  );
}