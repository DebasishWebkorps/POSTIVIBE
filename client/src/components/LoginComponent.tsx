import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { postLoginSuccessHandler } from "../services/apiServices";
import { motion } from 'framer-motion'

function LoginComponent() {

    const navigate = useNavigate()

    const successHandler = async (result) => {

        try {
            const response = await postLoginSuccessHandler(result.credential)

            localStorage.setItem('postivibecred', result.credential)
            alert(response.data.message)
            navigate('/')
        } catch (error) {
            console.log(error.message)
        }

    }

    const errorHandler = () => {
        alert('some error occured')
    }

    return (
        // <div className="w-full h-[100vh] bg-gradient-to-r from-amber-200 to-yellow-500 overflow-hidden flex justify-center items-center">
        <div className="w-full h-[100vh] bg-black flex justify-center items-center">

            <div className="w-max h-max overflow-hidden rounded-md bg-transparent shadow-xl flex flex-col justify-between p-10 items-center">
                <h2 className="text-center text-7xl text-white">Welcome Back</h2>
                {/* <img className="flex-1 w-full" src="./login.jpg" alt="" /> */}
                <motion.div
                    initial={{ translateY: 100 }}
                    animate={{ translateY: 0 }}
                    transition={{
                        duration: 0.5
                    }}
                    className="w-max mt-10"
                >
                    <GoogleLogin
                        onSuccess={successHandler}
                        onError={errorHandler}
                    />
                </motion.div>

            </div>

        </div>
    )
}

export default LoginComponent;