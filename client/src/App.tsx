import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginComponent from "./components/LoginComponent";
import { useEffect } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store/store";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./redux/slice/userSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import { addOwnReaction, addPost, reactToPost } from "./redux/slice/postSlice";
import { verifyUser } from "./services/apiServices";

function App(): JSX.Element {

  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const userCredential = localStorage.getItem('postivibecred') || null

  const navigate = useNavigate()
  const dispatch = useDispatch()


  const getUser = async () => {

    try {

      const response = await verifyUser();

      dispatch(setCurrentUser(response.data.user))

    } catch (error) {
      console.error(error.message)
      navigate('/login')
    }

  }

  useEffect(() => {
    socket.on('post Reaction', (data) => {
      dispatch(reactToPost(data))

      if (data.result.email === currentUser.email) {
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
    })


    if (userCredential) {
      getUser()
    } else {
      navigate('/login')
    }

    return (() => {
      socket.off('post Reaction')
    })

  }, [userCredential])


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
