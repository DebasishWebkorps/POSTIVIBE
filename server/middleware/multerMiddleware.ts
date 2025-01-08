import multer from 'multer'
const upload = multer({ dest: 'uploads/' })


const multerMiddleware = async (req, res, next) => {
    try {
        await upload.single('image')(req, res, (err) => {
            if (err) {
                return res.status(500).json({ message: 'File upload failed', error: err });
            }
            next();
        });


    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'File upload failed', error: error.message });
    }
}

export default multerMiddleware;