import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { postLoginSuccessHandler } from "../services/apiServices";

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
        <div className="w-full h-[100vh] bg-gradient-to-r from-amber-200 to-yellow-500 overflow-hidden flex justify-center items-center">


            <div className="w-52 h-1/2 bg-transparent bg-gray-50 bg-opacity-65 border-2 shadow-md flex flex-col justify-between p-2">
                <h2>Login</h2>
                <GoogleLogin
                    onSuccess={successHandler}
                    onError={errorHandler}
                />

            </div>
        </div>
    )
}

export default LoginComponent;