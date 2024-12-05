import axios from "axios"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store/store"
import { useDispatch } from "react-redux"
import { setPosts } from "../redux/slice/postSlice"

function CardElement(props) {
    const { data } = props

    const reactionHandler = async (id, reaction) => {

        const data = {
            credential: localStorage.getItem('postivibecred'),
            postid: id,
            reaction
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_server_url}/posts/reaction`, data);
            props.postReactionHandler(id)
        } catch (error) {
            console.error(error.message)
        }


    }


    return (
        <div className="my-4 pt-3 relative mx-auto w-10/12 rounded-md shadow-md bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:scale-x-105">

            <div className="flex justify-center">
                <p className="underline">{data.title}</p>
            </div>

            <p className="pb-3 px-4">{data.content}</p>


            <div
                className="w-20 text-nowrap flex items-center justify-between absolute right-0 bottom-0 mt-2 text-xs rounded-md p-2  cursor-pointer shadow-md bg-gradient-to-r from-yellow-400 to-orange-500 active:scale-90">

                {data.userReaction === 'like' && <span>Liked</span>}
                {data.userReaction === 'dislike' && <span>Disliked</span>}
                {!data.userReaction &&
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => reactionHandler(data.id, 'like')}
                            className="shadow-md">Like</button>
                        {
                            data.likes >= 1 &&
                            <button
                                onClick={() => reactionHandler(data.id, 'dislike')}
                                className="shadow-md">Dislike</button>
                        }
                    </div>
                }

                <span className="font-semibold">{data.likes}</span>
            </div>


        </div>
    )
}


function AddPostForm() {

    const titleRef = useRef<HTMLInputElement | null>()
    const contentRef = useRef<HTMLTextAreaElement | null>()

    const addPostHandler = async (event) => {
        event.preventDefault()

        try {

            if (titleRef.current && contentRef.current) {

                const post = {
                    title: titleRef.current.value,
                    content: contentRef.current.value,
                    credential: localStorage.getItem('postivibecred')
                }

                const response = await axios.post(`${process.env.REACT_APP_server_url}/posts/add`, post);


                // const addedPost = response.data.result.filteredPost
                // addedPost.reaction = null
                // console.log(addedPost)


                titleRef.current.value = ''
                contentRef.current.value = ''

            };

        } catch (error) {
            console.error(error.message)
        }

    }

    return (
        <div className="md:w-1/2 mt-6 mx-auto p-3 rounded-xl shadow-xl bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600">
            <form action="#" className="flex flex-col gap-4">
                <input
                    ref={titleRef}
                    className="w-full p-2 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out shadow-md resize-none"
                    placeholder="Enter Your title here..."
                    type="text" name="" id="" />
                <textarea
                    ref={contentRef}
                    className="w-full h-32 p-2 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out shadow-md resize-none"
                    placeholder="Write your content here..."
                />
                <button
                    onClick={(event) => addPostHandler(event)}
                    type="submit"
                    className="bg-gradient-to-r from-yellow-500 to-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gradient-to-l hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 ease-in-out shadow-lg"
                >
                    Add Post
                </button>
            </form>
        </div>
    )
}


function HomePage() {

    const currentUser = useSelector((state: RootState) => state.user.currentUser)

    const credential = localStorage.getItem('postivibecred')
    const dispatch = useDispatch()

    // const [posts, setPosts] = useState(null)
    const posts = useSelector((state: RootState) => state.posts.posts)

    const navigate = useNavigate()

    const fetchAllPosts = async () => {

        try {
            const response = await axios.get(`${process.env.REACT_APP_server_url}/posts`, {
                headers: {
                    Authorization: `Bearer ${credential}`,
                }
            });
            // setPosts(response.data.posts)
            dispatch(setPosts(response.data.posts))
        } catch (error) {
            console.error(error.message)
        }

    }


    const postReactionHandler = (id) => {

        const updatedPosts = posts.map(post => {
            if (post.id === id) {
                return {
                    ...post,
                    likes: post.likes + 1
                }
            } else {
                return post
            }
        })

        const sortedPosts = updatedPosts.sort((a, b) => b.likes - a.likes)

        // setPosts(sortedPosts)
        // dispatch(setPosts(sortedPosts))
    }


    useEffect(() => {
        fetchAllPosts()
    }, [])


    const logoutHandler = () => {
        navigate('/login')
    }


    return (
        <div className="min-h-[100vh] flex flex-col bg-gradient-to-r from-blue-800 to-indigo-900">
            <div className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white flex justify-between py-2 px-10 items-center">
                <div className="flex gap-2 items-center">
                    <img className="w-4 rounded-full shadow-md" src={`${currentUser?.image}`} alt="" />
                    <span>Hi, {currentUser.name}</span>
                </div>
                <button
                    onClick={logoutHandler}
                    className="px-6 py-2 rounded-md hover:text-white bg-cyan-400 text-black font-bold  hover:bg-yellow-400 hover:animate-pulse hover:shadow-lg hover:shadow-cyan-500/50 transition duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-yellow-400 before:translate-x-full hover:before:translate-x-0 before:transition before:duration-300 before:-z-10">
                    Logout
                </button>
            </div>

            {currentUser.role === 'admin' && <AddPostForm />}

            <div className="flex-1">
                {posts?.map(post => {
                    return <CardElement key={post.id} data={post} postReactionHandler={postReactionHandler} />
                })}

            </div>
        </div>
    )
}

export default HomePage;