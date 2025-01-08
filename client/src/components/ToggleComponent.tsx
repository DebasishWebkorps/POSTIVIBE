import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { useDispatch } from "react-redux";
import { setDayTheme, setNightTheme } from "../redux/slice/functionalitySlice";

function ToggleComponent() {

    const dispatch = useDispatch()
    const theme = useSelector((state: RootState) => state.functionality.functionality.theme)

    const themeChanged = {
        day: {
            left: 0
        },
        night: {
            right: 0
        }
    }

    const toggleDayHandler = () => {
        if (theme === 'day') {
            dispatch(setNightTheme())
        } else {
            dispatch(setDayTheme())
        }
    }

    return (
        <div className={`border-2 ${theme === 'day' ? "border-gray-500 bg-white " : "border-white bg-black shadow-gray-600"} shadow-md rounded-full overflow-hidden flex relative`}>

            <img src="day.png" className="opacity-0" width={24} alt="" />
            <img src="night.png" className="opacity-0" width={24} alt="" />

            <motion.div
                variants={themeChanged}
                animate={theme === 'day' ? 'night' : 'day'}
                transition={{ duration: 0.5 }}
                onClick={toggleDayHandler}
                className={`w-6 h-6 bg-gray-400 border border-white rounded-full absolute cursor-pointer`}>

                <img src={`${theme === 'night' ? "night.png" : "day.png"}`} width={24} alt={`${theme === 'night' ? "night" : "day"}`} />

            </motion.div>

        </div>
    )
}

export default ToggleComponent;