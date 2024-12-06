import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store/store"
import { useDispatch } from "react-redux"
import { setPosts } from "../redux/slice/postSlice"
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { addPost, getPost, postReaction } from "../services/apiServices"

function CardElement(props) {
    const { data } = props
    const [isReacting, setIsReacting] = useState(false)


    const reactionHandler = async (id, reaction) => {

        const data = {
            postid: id,
            reaction
        }

        try {
            setIsReacting(true)
            await postReaction(data)
            // props.postReactionHandler(id)
        } catch (error) {
            console.error(error.message)
        } finally {
            setIsReacting(false)
        }


    }


    return (
        <div className="my-4 pt-3 relative mx-auto w-10/12 rounded-md shadow-md bg-gradient-to-r from-blue-600 to-violet-600 text-white">

            <div className="flex justify-center">
                <p className="underline">{data.title}</p>
            </div>

            <p className="pb-3 px-4">{data.content}</p>


            <div
                className="w-20 text-nowrap flex items-center justify-center gap-2 absolute right-0 bottom-0 mt-2 text-xs rounded-md p-2  cursor-pointer shadow-md bg-gradient-to-r from-yellow-400 to-orange-500 active:scale-90">

                {data.userReaction === 'like' && <span>
                    <BiSolidLike size={20} />
                </span>}
                {data.userReaction === 'dislike' && <span>
                    <BiSolidDislike size={20} />
                </span>}
                {!data.userReaction &&
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => reactionHandler(data.id, 'like')}
                            disabled={isReacting}
                            className="shadow-md hover:scale-110">
                            <BiLike size={20} />
                        </button>
                        {
                            data.likes >= 1 &&
                            <button
                                onClick={() => reactionHandler(data.id, 'dislike')}
                                disabled={isReacting}
                                className="shadow-md hover:scale-110">
                                <BiDislike size={20} />
                            </button>
                        }
                    </div>
                }

                <span className="font-semibold">{data.likes}</span>
            </div>


        </div>
    )
}


function AddPostForm() {

    const [isSubmiting, setIsSubmitting] = useState(false)

    const titleRef = useRef<HTMLInputElement | null>()
    const contentRef = useRef<HTMLTextAreaElement | null>()

    const addPostHandler = async (event) => {
        event.preventDefault()

        try {
            setIsSubmitting(true)
            if (titleRef.current && contentRef.current) {

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
            setTimeout(() => {

                setIsSubmitting(false)
            }, 1000)
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
                    disabled={isSubmiting}
                    className="bg-gradient-to-r from-yellow-500 to-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gradient-to-l hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 ease-in-out shadow-lg"
                >
                    {isSubmiting ? 'Adding Post...' : 'Add Post'}
                </button>
            </form>
        </div>
    )
}


function HomePage() {

    const currentUser = useSelector((state: RootState) => state.user.currentUser)

    const dispatch = useDispatch()

    const posts = useSelector((state: RootState) => state.posts.posts)

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
                    return <CardElement key={post.id} data={post} />
                })}

            </div>
        </div>
    )
}

export default HomePage;