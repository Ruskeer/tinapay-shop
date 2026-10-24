import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from 'uniqid';



export async function POST(req){
    const data = await req.formData();

    if(data.get('file')){ //if i get the data
       //i can upload the file
       const file = data.get('file');

       const s3Client = new S3Client({ //
        region: 'ap-southeast-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY, //
            secretAccessKey: process.env.S3_SECRET_KEY, //
        },
       })
    
    const ext = file.name.split('.').slice(-1)[0]; //
    const newFileName = uniqid() + '.' + ext; //
    const chunks = [];
    for await (const chunk of file.stream()) { //
        chunks.push(chunk); //
    }

    const buffer = Buffer.concat(chunks); //
    const bucket = 'russelm-pandesal-ordering'; //
    console.log(newFileName);
    await s3Client.send(new PutObjectCommand({ //
        Bucket: bucket, //
        Key: newFileName,//
        ACL: 'public-read', //because if i send the file i want it to be publicly available
        ContentType: file.type, //
        Body: buffer, //
    }));

    const link = 'https://'+bucket+'.s3.ap-southeast-2.amazonaws.com/' +newFileName; //
    return Response.json(link); //
    }

    
    return Response.json(true);
}