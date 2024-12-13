import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store/store"
import { useDispatch } from "react-redux"
import { setPosts } from "../redux/slice/postSlice"
import { getPost } from "../services/apiServices"
import { AnimatePresence, easeInOut, motion } from 'framer-motion'
import CardElement from "./CardElement"
import AddPostForm from "./AddPostForm"
import { clearFeed } from "../redux/slice/liveFeedSlice"
import { RiDraftFill } from "react-icons/ri";
import { BiSolidDislike, BiSolidLike } from "react-icons/bi"
import { MdRssFeed } from "react-icons/md";
import { MdCreateNewFolder } from "react-icons/md";
import { SiMattermost } from "react-icons/si";
import { MdPlaylistRemove } from "react-icons/md";
import { GoDotFill } from "react-icons/go";




function HomePage() {
    const posts = useSelector((state: RootState) => state.posts.posts)
    const feeds = useSelector((state: RootState) => state.feeds.feeds)

    const currentUser = useSelector((state: RootState) => state.user.currentUser)
    

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


    return (
  
        <div className="h-[100vh] flex flex-col bg-gray-300 text-gray-800">

            {/* Navbar */}
            <div className="w-full bg-white text-white flex justify-between py-2 px-1 text-xs sm:text-sm sm:px-10 shadow-md z-10 items-center">

                <div className="flex gap-2 items-center">
                    <img className="w-4 rounded-full shadow-md" src={`${currentUser?.image}`} alt="" />
                    <span className="text-black font-semibold">POSTIVIBE</span>
                </div>

                <div className="flex gap-4">
                    
                    <button
                        onClick={logoutHandler}
                        className="px-6 py-2 rounded-md text-black font-semibold shadow-lg hover:scale-105 transform transition duration-300 relative overflow-hidden"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {addPost && <AddPostForm togglePostHandler={togglePostHandler} />}
            </AnimatePresence>
            {/* } */}
            <div className="grid grid-cols-[20%,1fr,20%] flex-1 gap-2 overflow-hidden">

                {/* Left Section */}
                

                <div className="flex flex-col h-full gap-2 items-center pt-5 bg-white sticky top-0 border-t">
                    <img className="w-1/2 rounded-full shadow-md" src={`${currentUser?.image}`} alt="Profile Image" />
                    <div className="w-max relative">
                        <span className="text-black font-semibold sm:text-sm md:text-lg">Hi, {currentUser.name}</span>
                        <div className="w-full h-1 opacity-50 absolute left-0 bottom-0 bg-yellow-400 -z-10 -rotate-2 -translate-y-1 rounded-lg"></div>
                    </div>

                    <div className="w-2/3 md:w-1/2 md:px-4 py-3 flex flex-col gap-2">

                        <div>
                            <p className="text-sm font-semibold flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <RiDraftFill />Posts
                                </span>
                                <span>20</span></p>
                            <div className="flex w-full h-1 bg-gray-500 rounded-lg"></div>
                        </div>

                        <div>
                            <p className="text-sm font-semibold flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <BiSolidLike />Likes
                                </span>
                                <span className="justify-end">14</span></p>
                            <div className="flex w-full h-1 bg-blue-500 rounded-lg"></div>
                        </div>

                        <div>
                            <p className="text-sm font-semibold flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <BiSolidDislike />Dislikes
                                </span>
                                <span>05</span></p>
                            <div className="flex w-full h-1 bg-red-500 rounded-lg"></div>
                        </div>
                    </div>


                    <button
                        onClick={togglePostHandler}
                        className="bg-gray-400 py-2 px-2 sm:px-4 md:px-8 rounded-full mt-10 text-white flex gap-1 items-center justify-between">
                        <MdCreateNewFolder />{addPost ? "Cancel Post" : "Create Post"}
                    </button>


                </div>

              







                {/* Middle Section */}
                <div className="flex-1 rounded-md bg-white pt-2 mt-2 grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">
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
                                        // delay: 0.3 * idx,
                                        duration: 0.5,
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

                <div className="bg-transparent grid grid-cols-1 grid-rows-2 gap-2 h-full rounded-lg font-sans from-gray-800 via-gray-900 to-black sticky top-0 text-white py-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">

                    <div className="overflow-hidden bg-white p-2 rounded-lg">

                        <h2 className="text-black text-center flex items-center gap-1 justify-center sm:text-sm md:text-lg ">Most Liked Posts <SiMattermost /></h2>
                        {posts?.map((post, idx) => {
                            return (
                                <motion.div
                                    key={idx}
                                    className="bg-gray-800 mb-1 sm:p-2 md:p-4 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300 border-b border-b-red-300"
                                    whileHover={{ scale: 1.1 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.5, delay: 0.1 * idx }}
                                >
                                    <h2 className="text-xs sm:text-sm font-semibold truncate">{post.title}</h2>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="flex-1 overflow-hidden bg-white p-2 rounded-lg">
                        <div className="flex items-center relative justify-center">
                            <h2 className="text-black text-center flex gap-1 items-center justify-center">Live Feed <MdRssFeed /></h2>
                            <span
                                onClick={() => {
                                    dispatch(clearFeed())
                                }}
                                className="cursor-pointer absolute right-0 hover:bg-gray-200 rounded-full p-1 active:scale-90">
                                <MdPlaylistRemove color="red" />
                            </span>
                        </div>

                        {feeds?.map((feed, idx) => {
                            return (
                                <motion.div
                                    key={idx}
                                    className="bg-gray-800 mb-1 sm:p-2 md:p-4 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-300 border-b border-b-red-300"
                                    whileHover={{ scale: 1.1 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h2 className={`text-xs sm:text-sm font-semibold truncate ${idx === 0 && 'text-yellow-300 flex justify-between items-center'}`}>{feed.feed} {idx === 0 &&
                                        <motion.span
                                            animate={{ scale: [1, 0, 1] }}
                                            transition={{
                                                repeat: Infinity,
                                                repeatType: "loop",
                                                duration: 2,
                                                ease: easeInOut
                                            }}
                                        >
                                            <GoDotFill color="yellow" />
                                        </motion.span>
                                    }
                                    </h2>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

            </div>

        </div>
    )
}

export default HomePage;