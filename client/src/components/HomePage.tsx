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
        <div className="min-h-[100vh] flex flex-col bg-gradient-to-r from-blue-800 to-indigo-900">

            <div className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white flex justify-between py-2 px-1 text-xs sm:text-sm sm:px-10 items-center">
                <div className="flex gap-2 items-center">
                    <img className="w-4 rounded-full shadow-md" src={`${currentUser?.image}`} alt="" />
                    <span>Hi, {currentUser.name}</span>
                </div>
                <div className="flex gap-4">
                    {currentUser.role === 'admin' &&
                        <button onClick={togglePostHandler} className="cursor-pointer">
                            {addPost ? "Cancel Post" : "Add Post"}
                        </button>
                    }
                    <button
                        onClick={logoutHandler}
                        className="px-6 py-2 rounded-md hover:text-white bg-cyan-400 text-black font-bold  hover:bg-yellow-400 hover:animate-pulse hover:shadow-lg hover:shadow-cyan-500/50 transition duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-yellow-400 before:translate-x-full hover:before:translate-x-0 before:transition before:duration-300 before:-z-10">
                        Logout
                    </button>
                </div>
            </div>

            {/* {currentUser.role === 'admin' && <AddPostForm />} */}
            {currentUser.role === 'admin' &&
                <AnimatePresence>
                    {addPost && <AddPostForm togglePostHandler={togglePostHandler} />}
                </AnimatePresence>}

            <div className="flex-1">
                <AnimatePresence>
                    {posts.map((post, idx) => {
                        // console.log(idx,post.id)
                        // const isMoved = post.id === posts[from].id || post.id === posts[to].id
                        return (
                            <motion.div
                                key={post.id}
                                // initial={{ scale: 0, translateY: 200 }}
                                animate={{
                                    scale: 1,
                                    translateY: 0,
                                    ...(moveDirection === 'up' && { translateY: -(distance * 20) }),  // Move up
                                    ...(moveDirection === 'down' && { translateY: (distance * 20) }), // Move down
                                    ...(moveDirection === 'same' && { translateY: 0 }), // No movement
                                }}
                                // exit={{ scale: 0, translateY: -200 }}
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
        </div>
    )
}

export default HomePage;