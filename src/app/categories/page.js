"use client";
import { useEffect, useState } from "react"
import UserTabs from "../components/layout/UserTabs"
import { useProfile } from "../components/UseProfile";
import toast from "react-hot-toast";
import Link from "next/link";
import Left from "../components/icons/left";
import DeleteButton from "../components/DeleteButton";

export default function CategoriesPage() {
    const [categories, setCategories] = useState('');
    const [CategoryName, setCategoryName] = useState('');
    const {loading:profileLoading, data:profileData} = useProfile();
    const [editedCategory, setEditedCategory] = useState(null);


    useEffect(() => {
        fetchCategories();
      
    }, []);

    function fetchCategories() {
         fetch('/api/categories').then(res => {
            res.json().then(categories => {
                setCategories(categories);
            });
    });
    }


    async function handleCategorySubmit(ev) { // runs when the form is submitted
        ev.preventDefault(); // stops the page from doing a full reload (default form behavior)
        const creationPromise = new Promise(async(resolve, reject) => { // manually create a Promise so toast.promise can track it
            const data = {name:CategoryName}; // packages the category name into an object, ready to send
            if (editedCategory) { // checks if we're currently editing an existing category (not creating a new one)
                data._id = editedCategory._id; // if editing, attach that category's original ID so the backend knows which one to update
            }
            const response = await fetch('/api/categories', { // order sent to the restaurant (your API)
            method: editedCategory ? 'PUT' : 'POST', // is the value are editedCategory then use PUT if not, then POST
            headers: {'Content-type': 'application/json'}, // tells the server we're sending JSON
            body: JSON.stringify(data), // the actual new category name being sent
        });
        setCategoryName('');
        
        fetchCategories();
        setEditedCategory(null);
        if (response.ok) // if the order went through successfully
            resolve();    // tell the Promise "success" - this triggers the success toast
        else
            reject(); // tell the Promise "failed" - this triggers the error toast
        

    });
    await toast.promise(creationPromise, { // watch the promise above and auto-show toasts based on it
        loading: 
        editedCategory ? 'Updating Category...' : 'Creating your new category...', // shown while waiting for response
        success: 
        editedCategory ? 'Category updated' : 'Category created', // shown if resolve() was called
        error: 'Error, sorry....', // shown if reject() was called
    });        
    }

    async function handleDeleteClick(_id) {
        const promise = new Promise(async(resolve,reject) => {
            const response = await fetch('/api/categories?_id='+_id, {
            method: 'DELETE',
        });
        if (response.ok) {
            resolve();
        } else {
            reject();
        }

      
     

        });
          await toast.promise(promise, {
            loading: 'Deleting category...',
            success: 'Category deleted',
            error: 'Error, sorry...'
        });
        fetchCategories();
    }





    if (profileLoading) {
        return 'Loading user info...';
    }

    if(!profileData.admin) {
        return 'Not an admin';
    }
     console.log('CATEGORIES:', categories);


    return (
        <section className="mt-8 max-w-2xl mx-auto">
            <UserTabs isAdmin={true}/>
             <div className="max-w-md mx-auto mt-8">
                <Link href={'/menu-items'} className="button">
                    <Left />
                    <span>Show all menu items</span>
            
                </Link>
            </div>
            <form className="mt-8" onSubmit={handleCategorySubmit}>
                <div className="mt-8 flex gap-2 items-end">
                    <div className="grow">
                        <label>
                            {editedCategory ? 'Update Category' : 'New Category name'}
                            {editedCategory && (
                                <>
                                    :<b> {editedCategory.name}</b>
                                </>
                            )}
                        </label>
                        <input 
                        type="text" 
                        value={CategoryName}
                        onChange={ev => setCategoryName(ev.target.value)}
                        ></input>
                    </div>
                    <div className="pb-2 flex gap-2">
                        <button className="border border-primary" type="submit">
                            {editedCategory ? 'Update' : 'Create'}
                        </button>
                        <button 
                        type="button"
                        onClick={() => 
                            {
                                setEditedCategory(null)
                                setCategoryName('')
                        }}>
                            Cancel</button>
                    </div>
                </div>
                
              
            </form>
            <div>
                <h2 className="mt-8 text-sm text-primary">Existing categories:</h2>
                {categories?.length > 0 && categories.map(c => (
                    <div 
                        key={c._id}
                        className="mb-1 bg-primary rounded-xl p-2 flex gap-1">
                        
                        <div
                        className="text-white grow">
                            {c.name}
                        </div>

                        <div className="flex gap-1">

                            <button type="button" onClick={() => {
                            setCategoryName(c.name);
                            setEditedCategory(c);

                            }} 
                            >     
                            Edit</button>

                            <DeleteButton 
                            label="Delete"
                            onDelete={() => handleDeleteClick(c._id)}
                            />
                        </div>
                    
                    </div>

                    
                ))}
            </div>
        </section>
    )
}