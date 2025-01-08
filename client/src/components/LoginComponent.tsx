import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { postLoginSuccessHandler } from "../services/apiServices";
import { motion } from 'framer-motion'
import { LiaVoteYeaSolid } from "react-icons/lia";
import { toast } from "react-toastify";


function LoginComponent() {

    const navigate = useNavigate()

    const successHandler = async (result) => {

        try {
            const response = await postLoginSuccessHandler(result.credential)

            localStorage.setItem('postivibecred', result.credential)
            toast.success(response.data.message)
            navigate('/')
        } catch (error) {
            toast.error(error.message)
        }

    }

    const errorHandler = () => {
        alert('some error occured')
    }

    return (
        <div className="w-full h-[100vh] flex justify-center items-center">

            <div className="w-max xl:w-96 h-max overflow-hidden rounded-md bg-transparent flex flex-col justify-between sm:p-10 items-center">
                <div className="w-full flex justify-center overflow-hidden">
                    <motion.p
                        initial={{ translateY: 200 }}
                        animate={{ translateY: 0 }}
                        exit={{ translateY: 400, scale: 0 }}
                        transition={{
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 0.5,
                            ease: 'easeInOut',
                            repeatDelay: 3
                        }}
                    >
                        <LiaVoteYeaSolid size={40} />
                    </motion.p>
                </div>
                <motion.h2
                    className="text-center text-xl font-serif">
                    Welcome to <span className="underline decoration-yellow-300 text-2xl">
                        Postivibe
                    </span>
                </motion.h2>
                <img className="w-full h-56 object-contain" src="./login.jpg" alt="" />
                <motion.div
                    initial={{ translateY: 100 }}
                    animate={{ translateY: 0 }}
                    transition={{
                        duration: 0.5
                    }}
                    whileHover={{ scale: 1.1 }}
                    className="mt-2"
                >
                    <GoogleLogin
                        onSuccess={successHandler}
                        onError={errorHandler}
                        width={80}
                    />
                </motion.div>

            </div>

        </div>
    )
}

export default LoginComponent;