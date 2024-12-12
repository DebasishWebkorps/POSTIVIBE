import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store/store"
import { useDispatch } from "react-redux"
import { setPosts } from "../redux/slice/postSlice"
import { getPost } from "../services/apiServices"
import { AnimatePresence, motion } from 'framer-motion'
import CardElement from "./CardElement"
import AddPostForm from "./AddPostForm"




function HomePage() {
    const posts = useSelector((state: RootState) => state.posts.posts)
    const feeds = useSelector((state: RootState) => state.feeds.feeds)


    const currentUser = useSelector((state: RootState) => state.user.currentUser)
    const from = useSelector((state: RootState) => state.posts.from)
    const to = useSelector((state: RootState) => state.posts.to)

    // const isMoved = from && to

    const dispatch = useDispatch()

    const [addPost, setAddPost] = useState(false)

    const navigate = useNavigate()

    const fetchAllPosts = async () => {

        try {
            const response = await getPost()
            dispatch(setPosts(response.data.posts))
        } catch (error) {
            console.error(error.message)
        }

    }

    useEffect(() => {
        fetchAllPosts()
    }, [])


    const logoutHandler = () => {
        localStorage.removeItem('postivibecred')
        navigate('/login')
    }

    const togglePostHandler = () => {
        setAddPost(!addPost)
    }

    let moveDirection;
    let distance;
    if (from > to) {
        moveDirection = 'up'
        distance = from - to
    } else if (to > from) {
        moveDirection = 'down'
        distance = to - from
    } else {
        moveDirection = 'same'
        distance = 1
    }



    return (
        // <div className="min-h-[100vh] flex flex-col">
        <div className="min-h-[100vh] flex flex-col bg-bla text-gray-800">
            {/* <div className="min-h-[100vh] flex flex-col bg-gradient-to-r from-[#d0d9dc] via-[#f9fbfc] to-[#b5c4d2] text-gray-800"> */}

            {/* Navbar */}
            <div className="w-full bg-transparent text-white flex justify-between py-2 px-1 text-xs sm:text-sm sm:px-10 shadow-md items-center">
                <div className="flex gap-2 items-center">
                    <img className="w-4 rounded-full shadow-md" src={`${currentUser?.image}`} alt="" />
                    <span className="text-black font-semibold">Hi, {currentUser.name}</span>
                </div>
                <div className="flex gap-4">
                    {currentUser.role === 'admin' &&
                        <button
                            onClick={togglePostHandler}
                            className="px-6 py-2 rounded-md hover:text-white text-black font-semibold shadow-lg transition duration-300 relative overflow-hidden"
                        >
                            {addPost ? "Cancel Post" : "Add Post"}
                        </button>
                    }
                    <button
                        onClick={logoutHandler}
                        className="px-6 py-2 rounded-md text-black font-semibold shadow-lg hover:scale-105 transform transition duration-300 relative overflow-hidden"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* {currentUser.role === 'admin' && <AddPostForm />} */}
            {currentUser.role === 'admin' &&
                <AnimatePresence>
                    {addPost && <AddPostForm togglePostHandler={togglePostHandler} />}
                </AnimatePresence>}
            <div className="grid grid-cols-[20%,1fr,20%] flex-1">

                {/* Left Section */}
                {/* <div className="bg-black sticky top-0 text-white flex flex-col items-center">
                    <p className="underline">Most Liked</p>
                    {posts.map(post => {
                        return (
                            <h2>{post.title}</h2>
                        )
                    })}
                </div> */}

                <div className="bg-gradient-to-r font-sans from-gray-800 via-gray-900 to-black sticky top-0 text-white py-4 px-6 max-h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    {feeds?.map((feed, idx) => {
                        return (
                            <motion.div
                                key={idx}
                                className="bg-gray-800 mb-3 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300 border-b border-b-red-300"
                                whileHover={{ scale: 1.1 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5, delay: 0.1 * idx }}
                            >
                                <h2 className="text-sm font-semibold truncate">{feed.feed}</h2>
                            </motion.div>
                        );
                    })}
                </div>







                {/* Middle Section */}
                <div className="flex-1 mt-2 grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    <AnimatePresence>
                        {posts.map((post, idx) => {
                            return (
                                <motion.div
                                    key={post.id}
                                    initial={{ scale: 0, translateY: 300 }}
                                    animate={{
                                        scale: 1,
                                        translateY: 0,
                                    }}
                                    transition={{
                                        delay: 0.3 * idx,
                                        duration: 1,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <CardElement data={post} />
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {/* Right Section */}

                <div className="bg-gradient-to-r font-sans from-gray-800 via-gray-900 to-black sticky top-0 text-white py-4 px-6 max-h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden">

                    {posts?.map((post, idx) => {
                        return (
                            <motion.div
                                key={idx}
                                className="bg-gray-800 mb-3 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300 border-b border-b-red-300"
                                whileHover={{ scale: 1.1 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5, delay: 0.1 * idx }}
                            >
                                <h2 className="text-sm font-semibold truncate">{post.title}</h2>
                            </motion.div>
                        );
                    })}
                </div>

            </div>

        </div>
    )
}

export default HomePage;