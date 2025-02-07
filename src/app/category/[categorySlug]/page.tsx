import { client } from '@/sanity/lib/client';
import React from 'react';
import Link from 'next/link';

interface Props {
  params: {
    categorySlug: string;
  };
}
interface Product {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  quantity: number;
  tags: string[];
  description: string;
  features: string[];
  dimensions: {
    depth: number;
    width: number;
    height: number;
  };
  category: {
    name: string;
    slug: string;
  };
}

const Page = async ({ params }: Props) => {
  // Sanity data fetch: Products based on category slug
  let sanityres;
  try{
   sanityres = await client.fetch(
    `*[_type == "product" && category->slug.current == $slug]{
      _id,
      name,
      "slug": slug.current,
      "imageUrl": image.asset->url,
      price,
      quantity,
      tags,
      description,
      features,
      dimensions {
        depth,
        width,
        height
      },
      category->{
        name,
        slug
      }
    }`,
    { slug: params.categorySlug }
  );

  if (!sanityres || sanityres.length === 0) {
    return <div>No products found in this category.</div>;
  }
}catch (error) {
  console.error("Error fetching products:", error);
  return <div>Failed to load products. Please try again later.</div>;
}

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-normal font-clash mb-4 capitalize">{sanityres[0].category.name} Products</h1>
        
        {/* Display Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sanityres.map((product:Product) => (
            <Link key={product._id} href={`/productpages/${product.slug}`}>
              <div className="border font-clash rounded p-4 shadow hover:shadow-lg transition">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded"
                />
                <h2 className="mt-2 font-normal">{product.name}</h2>
                <p className="text-gray-600">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
