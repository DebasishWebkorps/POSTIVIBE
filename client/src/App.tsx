import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginComponent from "./components/LoginComponent";
import { useEffect, useMemo } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store/store";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./redux/slice/userSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import { addOwnReaction, addPost, reactToPost } from "./redux/slice/postSlice";
import { verifyUser } from "./services/apiServices";
import { addFeed } from "./redux/slice/liveFeedSlice";

function App(): JSX.Element {

  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const userCredential = localStorage.getItem('postivibecred')

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
      dispatch(addFeed({ feed: feedMessage }))

      if (data.result.name === currentUser.name) {
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
      const feedMessage = filteredPost?.name === currentUser?.name ? 'I have added a Post' : `${filteredPost.name.split(' ')[0]} added a post`
      dispatch(addFeed({ feed: feedMessage }))
    })




    return (() => {
      socket.off('post added')
    })

  }, [currentUser])


  return (

    <Routes>
      <Route path="/login" element={<LoginComponent />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>

  );
}

export default App;
