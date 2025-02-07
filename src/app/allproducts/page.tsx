//import { client } from "@/sanity/lib/client"
import Allproducts from "../components/Allproducts"
//import Filters from "../components/filters"
import Footer from "../components/footer"
import Listings3 from "../components/listings3"



const AllProducts = async () => {
  /*const sanityres = await client.fetch(`*[_type == "product"]{
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
    }`)*/
  return (
    <div>
        
        <Allproducts/>
        {/*<Filters/>*/}
        <Listings3/>
        <Footer/>
    </div>
  )
}

export default AllProducts