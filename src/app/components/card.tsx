"use client"
import  Image, { StaticImageData } from 'next/image'

interface propstype  {
    
    image: string | StaticImageData
    imagetitle?: string,
    price: number
}

const Card = (props:propstype) => {
    const {image,imagetitle,price}= props
  return (
         <div>
             <div id="product-card" className="  w-auto h-auto flex flex-col  gap-[24px] cursor-pointer hover:scale-105 duration-1000 transition-transform ">
            <div id="parent" className=" w-auto h-[375px] overflow-hidden  ">
            <Image src={image} alt='asaas' height={200} width={300} className='object-cover w-[100%] min-h-[375px]  '/>
                
            </div>

            <div id="details" className="  sm:w-auto sm:h-auto  flex flex-col gap-2">
                <h4 className="font-clash font-normal text-[20px] leading-[28px] ">{imagetitle}</h4>
                <p className="font-satoshi font-normal text-[18px] leading-[27px] ">£{price}</p>
            </div>
        </div>
        
    </div>
    
  )
}

export default Card