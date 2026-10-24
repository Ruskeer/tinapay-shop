import AddToCartButton from "./AddToCartButton";

export default function MenuItemTile({onAddToCart, ...item}) {
    const {image,description,name,basePrice,sizes,extraIngredients} = item;
    const hasSizesOrExtras = sizes?.length > 0 || extraIngredients?.length > 0
    return (
        <div className="p-4 
            flex flex-col h-full
            bg-itemborder rounded-lg text-center hover:bg-white transition-all hover:shadow-2xl hover:shadow-black">
            
            <img src={image} alt={name} 
            className="aspect-square"/> {/* the item's photo (S3 link from the database) */}
            <h4 className="text-xl font-semibold my-3">{name}</h4> {/* the item's name */}
            <p className="text-primary text-sm line-clamp-3">
                        {description}</p> {/* the item's description, cut to 3 lines max */}
            <AddToCartButton 
                image={image}
                hasSizesOrExtras={hasSizesOrExtras}
                onClick={onAddToCart}
                basePrice={basePrice}
            />
        
        </div>
    );
}