import EditableImage from "@/app/components/layout/EditableImage";
import { useState } from "react";
import Trash from "../icons/Trash";
import Plus from "../icons/Plus";
import {useEffect} from "react";

import MenuItemPriceProps from "./MenuItemPriceProps";

export default function MenuItemForm({onSubmit, menuItem}) {

  
    const [image, setImage] = useState(menuItem?.image || '');
    const [name, setName] = useState(menuItem?.name || '');
    const [description, setDescription] = useState(menuItem?.description || '');
    const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
    const [sizes, setSizes] = useState(menuItem?.sizes || []);
    const [extraIngredients, setExtraIngredients] = useState(menuItem?.extraIngredients || []);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(menuItem?.category || '');

    useEffect(() => {
    fetch('/api/categories').then(res => {
        res.json().then(categories => {
            setCategories(categories);
            if (!category && categories.length > 0) {
                setCategory(categories[0]._id);
            }
        });
    })
    }, []);
    return(
        <form 
        onSubmit={ev => 
            onSubmit(ev, 
                {image,name,description,basePrice,sizes,extraIngredients,category,}
            )} 
        className="mt-8 max-w-md mx-auto ">
        <div className="md:grid flex gap-4 items-start"
        style={{gridTemplateColumns: '.3fr .7fr'}}
        >
            <div>
                <EditableImage link={image} setLink={setImage} />
            </div>
            <div className="grow">
                <label>Menu Item Name: </label>
                <input 
                type="text"
                value={name}
                onChange={ev => setName(ev.target.value)}
                ></input>

                <label>Description: </label>
                <input 
                type="text"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
                ></input>

                <label>Category</label>
                <select value={category} onChange={ev=> setCategory(ev.target.value)}>
                    {categories.length > 0 && categories.map(c => (
                        <option value={c._id}>{c.name}</option>
                    ))}
                </select>

                <label>Baseprice:  </label>
                <input 
                type="text"
                value={basePrice}
                onChange={ev => setBasePrice(ev.target.value)}
                ></input>

                <MenuItemPriceProps 
                addLabel={'Add item size'} name={'Sizes'} props={sizes} setProps={setSizes}/>

                <MenuItemPriceProps 
                addLabel={'Add extra ingredients'} name={'Extra Ingredients'} props={extraIngredients} setProps={setExtraIngredients}/>


                <button type="submit">Save</button>
            </div>
        </div>
    </form>
    );
}