import { client } from "@/sanity/lib/client"
import Card from "./card"
//import chair from "../assets/chair.png"
//import vase from "../assets/vase.png"
//import vase2 from "../assets/vase2.png"
//import lamp from "../assets/lamp.png"
import Link from "next/link"


/*const data = [
  {
    id: 1,
    image: "bg-[url('/fixchair.jpeg')]",
    imagetitle:"The Dandy chair",
    price:"£250",
  },
  {
    id: 2,
    image: "bg-[url('/fixvase.jpeg')]",
    imagetitle:"Rustic Vase Set",
    price:"£155",
  },
  {
    id: 3,
    image: "bg-[url('/fixvas2.jpeg')]",
    imagetitle:"The Silky Vase",
    price:"£125",
  },
  {
    id: 4,
    image: "bg-[url('/fixlamp.jpeg')]",
    imagetitle:"The Lucy Lamp",
    price:"£399",
  },
]*/
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

const Listing2 = async () => {
  let sanityres;
  try{
   sanityres = await client.fetch(`*[_type == "product"]{
    _id,  
    name,
    slug,
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
    <div className="w-auto  flex flex-col   sm:px-[80px]  px-[24px] pt-[80px]">
    <p className="font-clash font-normal text-[32px] leading-[39.36px] ">You might also like</p>
    <div className=" grid grid-cols-2 md:grid-cols-2 text-wrap lg:grid-cols-4  sm:mt-[33px] mt-[19px] gap-[16px] sm:gap-[20px] ">
      {sanityres.map((elem: ProductSummary)=>{
        return( 
          <Card key={elem._id} image={elem.imageUrl} price={elem.price} />
        )
      })}
      
      </div>
      <Link href={'allproducts'} id="button-medium" className=" w-auto sm:w-auto h-auto  bg-[#F9F9F9] flex mt-[40px] text-nowrap justify-center items-center self-center max-w-max  sm:mt-12 py-[16px] px-[32px] ">
            <p className="font-satoshi font-normal text-[16px] leading-[24px] ">View collection</p>
    </Link>
  
 </div>
  )
}

export default Listing2