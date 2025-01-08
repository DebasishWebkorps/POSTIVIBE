import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginComponent from "./components/LoginComponent";
import { useEffect } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store/store";
import { useDispatch } from "react-redux";
import { setCurrentUser, setTotalLikesDislikes, setTotalPosts } from "./redux/slice/userSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import { addOwnReaction, addPost, reactToPost } from "./redux/slice/postSlice";
import { verifyUser } from "./services/apiServices";
import { addFeed } from "./redux/slice/liveFeedSlice";
import { setRefreshToggle } from "./redux/slice/functionalitySlice";
import { Bounce, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App(): JSX.Element {

  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const userCredential = localStorage.getItem('postivibecred')
  const feedId = useSelector((state: RootState) => state.feeds.id)

  const navigate = useNavigate()
  const dispatch = useDispatch()



  const getUser = async () => {

    try {

      const response = await verifyUser();

      dispatch(setCurrentUser(response.data.user))
      navigate('/')
    } catch (error) {
      console.error(error.message)
      navigate('/login')
    }

  }

  useEffect(() => {
    if (userCredential) {
      getUser()
    } else {
      navigate('/login')
    }
  }, [userCredential])


  useEffect(() => {

    socket.on('post Reaction', (data) => {

      dispatch(reactToPost(data))
      const feedMessage = data?.result?.name === currentUser?.name ? `I ${data.reaction}d a post` : `${data?.result?.name.split(' ')[0]} ${data?.reaction}d a post`
      dispatch(addFeed({
        id: feedId + 1,
        feed: feedMessage
      }))
      dispatch(setRefreshToggle())

      if (data.result.name === currentUser.name) {
        dispatch(setTotalLikesDislikes(data.result.reactions))
        dispatch(addOwnReaction(data))
      }
    })

    return (() => {
      socket.off('post Reaction')
    })
  }, [currentUser])


  useEffect(() => {

    socket.on('post added', ({ filteredPost }) => {
      dispatch(addPost(filteredPost))
      const feedMessage = filteredPost?.userName === currentUser?.name ? 'I have added a Post' : `${filteredPost.userName.split(' ')[0]} added a post`
      dispatch(addFeed({
        id: feedId + 1,
        feed: feedMessage
      }))
      dispatch(setTotalPosts())
    })


    return (() => {
      socket.off('post added')
    })

  }, [currentUser])


  return (

    <div>

      <Routes>
        <Route path="/login" element={<LoginComponent />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

    </div>

  );
}

export default App;
