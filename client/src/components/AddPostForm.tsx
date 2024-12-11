import { useRef, useState } from "react"
import { motion } from 'framer-motion'
import { addPost } from "../services/apiServices"

function AddPostForm({ togglePostHandler }) {

    const [isSubmiting, setIsSubmitting] = useState(false)
    const [error, setError] = useState({
        title: '',
        description: ''
    })

    const titleRef = useRef<HTMLInputElement | null>()
    const contentRef = useRef<HTMLTextAreaElement | null>()

    const addPostHandler = async (event) => {
        event.preventDefault()

        try {
            setIsSubmitting(true)
            if (titleRef.current && contentRef.current) {

                if (titleRef.current.value === '' && contentRef.current.value === '') {
                    setError({
                        title: 'Title Required',
                        description: 'Content Required'
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

                setError({
                    title: '',
                    description: ''
                })

                const post = {
                    title: titleRef.current.value,
                    content: contentRef.current.value,
                }

                await addPost(post)

                titleRef.current.value = ''
                contentRef.current.value = ''

            };

        } catch (error) {
            console.error(error.message)
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

            onClick={(event) => {
                togglePostHandler()
            }}

            className="w-full fixed left-0 top-0 h-[100vh] z-10 overflow-hidden flex justify-center items-center backdrop-blur-sm">
            <form action="#"
            onClick={(event)=> event.stopPropagation()}
             className="flex flex-col w-1/2 mx-auto gap-4 border p-3 rounded-md backdrop-blur-xl">
                <input
                    ref={titleRef}
                    onChange={titleChangeHandler}
                    className="w-full p-2 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out shadow-md resize-none"
                    placeholder="Enter Your title here..."
                    type="text" name="" id="" />
                {error.title !== '' &&
                    <p className="text-red-500 font-bold">
                        {error.title}
                    </p>}
                <textarea
                    ref={contentRef}
                    onChange={contentChangeHandler}
                    className="w-full h-32 p-2 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out shadow-md resize-none"
                    placeholder="Write your content here..."
                />
                {error.description !== '' &&
                    <p className="text-red-500 font-bold">
                        {error.description}
                    </p>}
                <div className="grid grid-cols-2 gap-4 ">

                    <button
                        onClick={(event) => {
                            event.preventDefault();
                            togglePostHandler()
                        }}
                        className="bg-gradient-to-r from-purple-500 to-pink-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gradient-to-l hover:from-purple-400 hover:to-pink-500 transition-all duration-300 ease-in-out shadow-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={(event) => addPostHandler(event)}
                        type="submit"
                        disabled={isSubmiting}
                        className="bg-gradient-to-r from-yellow-500 to-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gradient-to-l hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 ease-in-out shadow-lg"
                    >
                        {isSubmiting ? 'Adding Post...' : 'Add Post'}
                    </button>
                </div>
            </form>
        </motion.div >
    )
}

export default AddPostForm;