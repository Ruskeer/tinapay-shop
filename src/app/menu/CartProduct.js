import { cartProductPrice } from "../components/AppContext";
import Trash from "../components/icons/Trash";
import Image from "next/image";

export default function CartProduct({product, onRemove, index}) {
    return (
        <div className="flex gap-4 items-center border-b py-4">
            <div className="w-24"> 
                <Image width={240} height={240} src={product.image} alt ={''} priority/>
            </div>
            <div className="grow">
                <h3 className="font-semibold">
                    {product.name}</h3>
                {product.size && (
                    <div className="text-sm text-primary"
                    >Size: <span>{product.size.name}
                    </span></div>
                )}
                {product.extras?.length > 0 && (
                    <div className="text-sm text-primary">
                        {product.extras.map(extra => (
                            <div key={extra._id || extra.name}>{extra.name} P{extra.price}</div>
                        ))}
                    </div>
                )}
            </div>
            


                <div className="text-lg font-semibold">
                    P{cartProductPrice(product)}
                </div>

                {!!onRemove && (
                    <div className="ml-2">
                        <button 
                            onClick={() => onRemove(index)}
                            type="button"
                            className="p-2">
                            <Trash />
                        </button>
                    </div>
                )}

                
            </div>
    );
}