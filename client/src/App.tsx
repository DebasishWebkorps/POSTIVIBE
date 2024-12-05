import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginComponent from "./components/LoginComponent";
import { useEffect } from "react";
import { socket } from "./socket";
// import NewPage from "./components/NewPage";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store/store";
import axios from "axios"
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./redux/slice/userSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import { addOwnReaction, addPost, reactToPost } from "./redux/slice/postSlice";

function App(): JSX.Element {

  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  console.log(currentUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const getUser = async (credential) => {

    try {
      const response = await axios.get(`${process.env.REACT_APP_server_url}/user/verify`, {
        headers: {
          Authorization: `Bearer ${credential}`,
        }
      });
      dispatch(setCurrentUser(response.data.user))
    } catch (error) {
      console.error(error.message)
      navigate('/login')
    }

  }

  useEffect(() => {
    socket.on('post Reaction', (data) => {
      dispatch(reactToPost(data))
      console.log(data.result.email , currentUser.email,'==',data.result.email === currentUser.email)
      if (data.result.email === currentUser.email) {
        dispatch(addOwnReaction(data))
      }
    })

    return (() => {
      socket.off('post Reaction')
    })
  }, [currentUser])


  useEffect(() => {
    // socket.on('connect', () => {
    //   console.log('Connected to Server')
    // })

    socket.on('post added', ({ filteredPost }) => {
      // filteredPost.reaction = null
      dispatch(addPost(filteredPost))
    })




    const userCredential = localStorage.getItem('postivibecred') || null

    if (userCredential) {
      getUser(userCredential)
    } else {
      navigate('/login')
    }

  }, [])


  return (

    <Routes>
      <Route path="/login" element={<LoginComponent />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/new" element={<NewPage />} /> */}
      </Route>
    </Routes>

  );
}

export default App;
