const cloudinary = require('cloudinary');
const fs = require('fs');

const cloudinaryUpload = async (file: any) => {

    try {

        if (!file) {
            return { message: 'File upload failed' };
        }


        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret
        });

        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'postivibeGallery'
        });



        fs.unlink(file.path, (err) => {
            if (err) {
                console.error(`Error removing file: ${err}`);
            }
        })

        return result


    } catch (error) {
        console.log('cloudinary upload error', error.message)
        return { message: 'Some Error Occured' };
    }

}

export default cloudinaryUpload