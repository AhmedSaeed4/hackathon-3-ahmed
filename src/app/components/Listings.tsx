import { client } from "@/sanity/lib/client"
import Card from "./card"
//import chair from "../assets/chair.png"
//import vase from "../assets/vase.png"
//import vase2 from "../assets/vase2.png"
//import lamp from "../assets/lamp.png"
import Link from "next/link"
interface ProductSummary {
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
    depth?: number;
    width?: number;
    height?: number;
  };
  category: {
    name: string;
    slug: string;
  };
}

const Listings = async () => {
  let sanityres;
  try{
   sanityres = await client.fetch(`*[_type == "product"][0...4]{
    _id,  
    name,
    "slug": slug.current,
   "imageUrl": image.asset->url,
    price,
    quantity,
    tags,
    description,
    features,
    dimensions,
    category->{   
      name,  
      slug    
    }
  }`)} catch (error) {
    console.error("Error fetching products:", error);
    return <div>Failed to load products. Please try again later.</div>;
  }
  return (
    <div className=" flex flex-col sm:px-[80px]  px-[24px] pt-[20px] pb-[40px] ">
    <div className=" grid grid-cols-1 md:grid-cols-2 text-wrap lg:grid-cols-2 xl:grid-cols-4  gap-[16px] sm:gap-[20px] ">
      {sanityres.map((elem:ProductSummary)=>{
        return( 
          <Link key={elem._id} href={`../productpages/${elem.slug}`} >
          <Card  image={elem.imageUrl} imagetitle={elem.name} price={elem.price} />
          </Link>
        )
      })}
      
      </div>
      <Link href={'../allproducts'} id="button-medium" className=" w-auto sm:w-auto h-auto transition-all duration-700 ease-in-out hover:bg-gray-300
        transform hover:scale-105  bg-[#F9F9F9] flex mt-[40px] text-nowrap justify-center items-center self-center max-w-max  sm:mt-12 py-[16px] px-[32px] ">
              <p className="font-satoshi font-normal text-[16px] leading-[24px] ">View collection</p>
      </Link>
    </div>
  )
}

export default Listings