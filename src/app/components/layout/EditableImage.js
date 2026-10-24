import toast from "react-hot-toast";
import { useState } from "react";

export default function EditableImage({link, setLink}) {
    



    async function handleFileChange(ev) { // triggers when user picks an image
       
        const files = ev.target.files;
        if(files?.length > 0) { // checks if they actually picked something
           
            const data = new FormData; // prepares file data to send
            data.set('file', files[0]);
         

            
            const uploadPromise = fetch('/api/upload', {
            method: 'POST', // tells api to create/upload file
            body: data, // attaches the file data
            //headers: {'Content-type': 'multipart/form-data'}

            }).then(response => { //
                if (response.ok) { //
                    return response.json().then(link => { //
                        setLink(link); //
                      
                    })
            
                } 
                throw new Error('Something went wrong.');
            });
            

        await toast.promise(uploadPromise, { //
            loading: 'Uploading...', 
            success: 'Upload Complete', 
            error: 'Upload Error', 
        });
           
        


        }
    }


    return (
        <>
            {link &&(
                <img className=" mb-1" alt="avatar" src={link} width={125} height={125} />
                )}

            {!link && (
                <div className="text-center bg-primary p-4 text-bg rounded-lg mb-1">
                    No image
                </div>
            )}
                            
            <label>
                <input type="file" className="hidden" onChange={handleFileChange}></input>
                <span className="shadow bg-bg cursor-pointer text-center block border p-2 rounded-lg">Edit Image</span>
            </label>
        </>
    );
}