import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store/store"
import { useDispatch } from "react-redux"
import { setPosts } from "../redux/slice/postSlice"
import { getMostLikedPosts, getPost } from "../services/apiServices"
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
import { RiSparkling2Line } from "react-icons/ri";
import { BiRefresh } from "react-icons/bi";
import { setAddPostToggle, setCurrentPage, setFetchingFalse, setFetchingTrue, setIsLast, setLoadingFalse, setLoadingTrue, setMostLikedPost, setRefreshToggle } from "../redux/slice/functionalitySlice"
import { toast } from "react-toastify"
import ToggleComponent from "./ToggleComponent"




function HomePage() {

    const currentPage = useSelector((state: RootState) => state.functionality.functionality.currentPage)
    const loading = useSelector((state: RootState) => state.functionality.functionality.loading)
    const isFetching = useSelector((state: RootState) => state.functionality.functionality.isFetching)
    const isLast = useSelector((state: RootState) => state.functionality.functionality.isLast)
    const addPost = useSelector((state: RootState) => state.functionality.functionality.addPost)
    const mostLikedPost = useSelector((state: RootState) => state.functionality.functionality.mostLikedPost)
    const refresh = useSelector((state: RootState) => state.functionality.functionality.refresh)
    const theme = useSelector((state: RootState) => state.functionality.functionality.theme)

    const middleSectionRef = useRef<HTMLDivElement | null>(null);

    const posts = useSelector((state: RootState) => state.posts.posts)
    const feeds = useSelector((state: RootState) => state.feeds.feeds)
    const currentUser = useSelector((state: RootState) => state.user.currentUser)

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const fetchAllPosts = async (page: number) => {

        try {
            dispatch(setLoadingTrue())
            dispatch(setFetchingTrue())
            // await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await getPost(page)

            dispatch(setIsLast(response.data.totalPages))
            dispatch(setPosts(response.data.posts))
        } catch (error) {
            console.error(error.message)
        } finally {
            dispatch(setLoadingFalse())
            dispatch(setFetchingFalse())
        }

    }

    const fetchMostLikedPosts = async () => {

        try {
            const response = await getMostLikedPosts()
            dispatch(setMostLikedPost(response.data.mostLikedPosts))

        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
        fetchAllPosts(currentPage);
    }, [currentPage]);

    useEffect(() => {
        fetchMostLikedPosts()
    }, [refresh])


    const handleScroll = () => {

        if (!middleSectionRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = middleSectionRef.current;

        if (scrollTop + clientHeight >= scrollHeight - 50 && !loading && !isFetching) {
            if (currentPage < isLast) {
                dispatch(setFetchingTrue())
                dispatch(setCurrentPage())
            }
        }
    };


    useEffect(() => {

        if (middleSectionRef.current) {
            middleSectionRef.current.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (middleSectionRef.current) {
                middleSectionRef.current.removeEventListener("scroll", handleScroll);
            }
        };
    }, [loading, isFetching]);



    const logoutHandler = () => {
        localStorage.removeItem('postivibecred')
        toast.success('Logout Successfully')
        navigate('/login')
    }

    const togglePostHandler = () => {
        dispatch(setAddPostToggle())
    }

    const refreshHandler = () => {
        setMostLikedPost([])
        dispatch(setRefreshToggle())
    }


    return (

        <div className={`h-[100vh] flex flex-col ${theme === 'day' ? "bg-gray-300" : "bg-gray-700"}`}>

            {/* Navbar */}
            <div className={`w-full ${theme === 'day' ? "bg-white text-black" : "bg-black text-white shadow-gray-600"} flex justify-between py-2 px-1 text-xs sm:text-sm sm:px-10 shadow-md  z-10 items-center`}>

                <div className="flex gap-2 items-center">
                    <img className="w-4 rounded-full shadow-md" src={`${currentUser?.image}`} alt="" />
                    <span className="font-semibold">POSTIVIBE</span>
                </div>

                <div className="flex gap-6 items-center">

                    <div>
                        <ToggleComponent />
                    </div>

                    <button
                        onClick={logoutHandler}
                        className={`px-6 py-2 rounded-md font-semibold shadow-lg ${theme === 'night' && "shadow-white shadow-sm"} hover:scale-105 active:scale-90 transform transition duration-300 relative overflow-hidden`}
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


                <div className={`flex flex-col h-full gap-2 items-center pt-5 ${theme === 'day' ? "bg-white text-black" : "bg-black text-white"}  sticky top-0 border-t overflow-hidden`}>
                    <img className="w-1/2 rounded-full shadow-md" src={`${currentUser?.image}`} alt="Profile Image" />
                    <div className="w-max relative">
                        <span className="font-semibold text-[6px] sm:text-sm md:text-lg flex gap-1 items-center">Hi, {currentUser?.name} <RiSparkling2Line color="gold" /></span>
                        <div className="w-11/12 h-1 opacity-50 absolute left-0 bottom-0 bg-yellow-400 -z-10 -rotate-2 sm:-translate-y-1 rounded-lg"></div>
                    </div>

                    <div className="w-full sm:w-2/3 md:w-1/2 px-1 md:px-4 py-3 text-xs sm:text-sm flex flex-col gap-2 overflow-hidden">

                        <div>
                            <p className="text-sm font-semibold flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <RiDraftFill color="gray" /> <span className="hidden sm:block">Posts</span>
                                </span>
                                <span>{currentUser?.totalPost}</span></p>
                            <div className="flex w-full h-1 bg-gray-500 rounded-lg"></div>
                        </div>

                        <div>
                            <p className="text-sm font-semibold flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <BiSolidLike color="blue" /><span className="hidden sm:block">Likes</span>
                                </span>
                                <span className="justify-end">{currentUser?.totalLikes}</span></p>
                            <div className="flex w-full h-1 bg-blue-500 rounded-lg"></div>
                        </div>

                        <div>
                            <p className="text-sm font-semibold flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <BiSolidDislike color="red" /><span className="hidden sm:block">Dislikes</span>
                                </span>
                                <span>{currentUser?.totalDislikes}</span></p>
                            <div className="flex w-full h-1 bg-red-500 rounded-lg"></div>
                        </div>
                    </div>


                    <button
                        onClick={togglePostHandler}
                        className="bg-gray-400 py-2 px-4 text-xs sm:text-sm sm:px-4 lg:px-8 rounded-full mt-10 text-white flex gap-1 items-center justify-between">
                        <MdCreateNewFolder /><span className="hidden sm:block">{addPost ? "Cancel Post" : "Create Post"}</span>
                    </button>


                </div>



                {/* Middle Section */}
                <div
                    ref={middleSectionRef}
                    className={`flex-1 rounded-t-md ${theme === 'day' ? "bg-white" : "bg-black"}  pt-2 pb-4 mt-2 grid gap-2 gap-y-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 px-2 overflow-y-auto [&::-webkit-scrollbar]:hidden`}>
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
                                        duration: 0.5,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <CardElement data={post} />
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                    {loading && (
                        <motion.div
                            className="w-full text-center py-4"
                            initial={{ opacity: 0, color: "red" }}
                            animate={{ opacity: 1, color: `${theme === 'day' ? 'black' : 'white'}` }}
                            transition={{
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 0.3,
                            }}

                        >
                            <span>{currentPage === 1 ? "Loading posts..." : "Loading more posts..."}</span>
                        </motion.div>
                    )}

                    {(currentPage === isLast) && < div className={`flex flex-col justify-end ${theme === 'day' ? "bg-white text-red-500" : "bg-black text-red-500"}`}>
                        <span>No More Posts...</span>
                    </div>}

                </div>

                {/* Right Section */}

                <div className="bg-transparent grid grid-cols-1 grid-rows-2 gap-2 h-full rounded-lg font-sans from-gray-800 via-gray-900 to-black sticky top-0 text-white py-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">

                    <div className={`overflow-hidden ${theme === 'day' ? "bg-white text-black" : "bg-black text-white"}  p-2 rounded-lg`}>
                        <div className="shadow-md mb-2 flex items-center justify-center relative">
                            <h2 className="text-center flex items-center gap-1 justify-center text-xs sm:text-sm xl:text-lg "> <span className="hidden sm:block">Most Liked Posts</span> <SiMattermost /></h2>
                            <button
                                onClick={refreshHandler}
                                className="absolute right-0 p-1 cursor-pointer hover:bg-gray-200 rounded-full active:scale-90">
                                <BiRefresh color="red" />
                            </button>
                        </div>
                        {mostLikedPost?.map((post: any, idx) => {
                            return (

                                <motion.div
                                    key={idx}
                                    className={`${theme === 'day' ? "bg-white text-black" : "bg-black text-white"} flex items-center gap-2 mb-2 p-2 rounded-lg shadow-md hover:bg-gray-100 hover:text-black transition-colors duration-300 border-b border-b-gray-300`}
                                    whileHover={{ scale: 1.05 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="w-6 h-6 rounded-full overflow-hidden shadow-md">
                                        <img className="object-cover" src={post.image} width={32} height={32} alt="User" />
                                    </div>

                                    <h2 className="text-xs sm:text-sm font-semibold truncate">{post.title}</h2>
                                </motion.div>



                            );
                        })}
                    </div>

                    <div className={`flex-1 overflow-hidden ${theme === 'day' ? "bg-white text-black" : "bg-black text-white"}  p-2 rounded-lg`}>
                        <div className="flex items-center relative justify-center">
                            <h2 className="text-center flex gap-1 items-center justify-center"><span className="hidden sm:block">Live Feed</span> <MdRssFeed /></h2>
                            <button
                                onClick={() => {
                                    dispatch(clearFeed())
                                }}
                                className="cursor-pointer absolute right-0 hover:bg-gray-200 rounded-full p-1 active:scale-90">
                                <MdPlaylistRemove color="red" />
                            </button>
                        </div>

                        {feeds?.map((feed, idx) => {
                            return (
                                <motion.div
                                    key={feed.id}
                                    className={`${theme === 'day' ? "bg-white text-black" : "bg-black text-white"} flex items-center gap-2 mb-2 p-2 rounded-lg shadow-md hover:bg-gray-100 hover:text-black transition-colors duration-300 border-b border-b-gray-300`}

                                    whileHover={{ scale: 1.1 }}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h2 className={`text-xs sm:text-sm font-semibold w-full truncate ${idx === 0 && 'flex justify-between items-center'}`}>{feed.feed} {idx === 0 &&
                                        <motion.span
                                            animate={{ scale: [1.1, 0.1, 1.1] }}
                                            transition={{
                                                repeat: Infinity,
                                                repeatType: "loop",
                                                duration: 1,
                                                ease: easeInOut
                                            }}
                                        >
                                            <GoDotFill color="red" />
                                        </motion.span>
                                    }
                                    </h2>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

            </div>

        </div >
    )
}

export default HomePage;