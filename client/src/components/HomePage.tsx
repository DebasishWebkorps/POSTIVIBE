import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function CardElement(props) {
    const { data } = props
    return (
        <div className="w-10/12 bg-red-200 mx-auto my-4 p-3 rounded-md relative shadow-md hover:translate-x-6 hover:h-36">

            <div className="flex justify-center">
                <p className="underline">{data.title}</p>
            </div>

            <p>{data.content}</p>

            <div className="absolute bottom-0 right-0 text-xs rounded-md p-2 cursor-pointer shadow-md bg-white active:scale-90">
                Like <span className="font-semibold">{data.likes}</span>
            </div>
        </div>
    )
}



function HomePage() {

    const [posts, setPosts] = useState(null)
    const [userDetail, setUserDetail] = useState(null)

    const navigate = useNavigate()

    const fetchAllPosts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_server_url}/posts`)
            setPosts(response.data.posts)
        } catch (error) {
            console.error(error.message)
        }

    }


    useEffect(() => {
        fetchAllPosts()
    }, [])


    const logoutHandler = () => {
        navigate('/login')
    }


    return (
        <div className="min-h-[100vh] flex flex-col">
            <div className="w-full bg-yellow-600 flex justify-between py-2 px-10 items-center">
                <div className="flex gap-2 items-center">
                    <img className="w-4" src="./logo192.png" alt="" />
                    <span>Hi, Debasish</span>
                </div>
                <button onClick={logoutHandler}>Logout</button>
            </div>

            <div className="bg-gradient-to-b from-amber-100 to-amber-300 flex-1">

                {posts?.map(post => {
                    return <CardElement key={post.id} data={post} />
                })}

            </div>
        </div>
    )
}

export default HomePage