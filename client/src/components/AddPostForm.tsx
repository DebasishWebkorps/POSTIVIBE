import { useRef, useState } from "react"
import { motion } from 'framer-motion'
import { addPost } from "../services/apiServices"
import { toast } from "react-toastify"

function AddPostForm({ togglePostHandler }) {

    const [isSubmiting, setIsSubmitting] = useState(false)
    const [error, setError] = useState({
        title: '',
        description: '',
        image: ''
    })

    const titleRef = useRef<HTMLInputElement | null>(null)
    const contentRef = useRef<HTMLTextAreaElement | null>(null)
    const fileRef = useRef<HTMLInputElement | null>(null);


    const addPostHandler = async (event) => {
        event.preventDefault()

        try {
            setIsSubmitting(true)
            if (titleRef.current && contentRef.current) {

                if (titleRef.current.value === '' && contentRef.current.value === '') {
                    setError({
                        title: 'Title Required',
                        description: 'Content Required',
                        image: 'Image Required'
                    })
                    return
                }

                if (titleRef.current.value === '') {
                    setError({ ...error, title: 'Title Required' })
                    return
                }

                if (contentRef.current.value === '') {
                    setError({ ...error, description: 'Content Required' })
                    return
                }

                if (!fileRef.current?.files || fileRef.current.files.length === 0) {
                    setError({ ...error, image: 'Image Required' });
                    return;
                }




                setError({
                    title: '',
                    description: '',
                    image: ''
                })

                const formData = new FormData();
                formData.append("title", titleRef.current.value);
                formData.append("content", contentRef.current.value);
                formData.append("image", fileRef.current.files[0]);

                await addPost(formData)


                titleRef.current.value = '';
                contentRef.current.value = '';
                fileRef.current.value = '';
                togglePostHandler()
            };

        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }

    }

    const titleChangeHandler = () => {
        if (error.title !== '' && titleRef.current.value !== '') {
            setError({ ...error, title: '' })
        }

        if (error.title === '' && titleRef.current.value === '') {
            setError({ ...error, title: 'Title Required' })
        }


    }

    const contentChangeHandler = () => {
        if (error.description !== '' && contentRef.current.value !== '') {
            setError({ ...error, description: '' })
        }

        if (error.description === '' && contentRef.current.value === '') {
            setError({ ...error, description: 'Content Required' })
        }
    }


    return (

        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(event) => togglePostHandler()}
            className="w-full fixed left-0 top-0 h-[100vh] z-10 overflow-hidden flex justify-center items-center backdrop-blur-sm">
            <form
                action="#"
                encType="multipart/form-data"
                onClick={(event) => event.stopPropagation()}
                className="relative flex flex-col w-full sm:w-1/3 md:w-2/5 lg:w-1/4 mx-auto gap-4 p-4 rounded-xl rounded-tr-none bg-white shadow-lg border border-gray-200">

                <div
                onClick={togglePostHandler}
                    className="bg-white rounded-full border absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 px-3 py-1 cursor-pointer text-red-600">
                    X
                </div>

                <input
                    ref={titleRef}
                    onChange={titleChangeHandler}
                    className="w-full p-2 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 ease-in-out shadow-md"
                    placeholder="Enter Your Title Here"
                    type="text"
                    id="title" />

                {error.title !== '' && <p className="text-red-500 font-semibold text-xs">{error.title}</p>}

                <textarea
                    ref={contentRef}
                    onChange={contentChangeHandler}
                    className="w-full h-32 p-2 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 ease-in-out shadow-md resize-none"
                    placeholder="Write your content here..."
                />

                {error.description !== '' && <p className="text-red-500 font-semibold text-xs">{error.description}</p>}

                <div className="flex flex-col gap-2">
                    <input
                        ref={fileRef}
                        type="file"
                        name="image"
                        id="image"
                        className="w-full p-1 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 ease-in-out shadow-md cursor-pointer"
                    />
                    {error.image !== '' && <p className="text-red-500 font-semibold text-xs">{error.image}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={(event) => {
                            event.preventDefault();
                            togglePostHandler()
                        }}
                        className="bg-gray-600 py-1 text-white rounded-lg font-semibold hover:bg-gray-500 transition-all duration-300 ease-in-out shadow-md"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={(event) => addPostHandler(event)}
                        type="submit"
                        disabled={isSubmiting}
                        className="bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-all duration-300 ease-in-out shadow-md"
                    >
                        {isSubmiting ? 'Adding Post...' : 'Add Post'}
                    </button>
                </div>
            </form>
        </motion.div>

    )
}

export default AddPostForm;