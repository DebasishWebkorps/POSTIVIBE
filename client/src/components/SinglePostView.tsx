import { memo, useState } from "react";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { postReaction } from "../services/apiServices";
import { motion } from "framer-motion";
import { IoIosCloseCircleOutline } from "react-icons/io";


function SinglePostView(props) {
    const { data, closeModal } = props;
    const [isReacting, setIsReacting] = useState(false);

    const reactionHandler = async (id, reaction) => {
        const postData = {
            postid: id,
            reaction
        };

        try {
            setIsReacting(true);
            await postReaction(postData);
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsReacting(false);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => closeModal()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div
                className="bg-white rounded-md shadow-lg max-w-lg w-full p-4 relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex relative items-center">
                    <button
                        className="absolute right-0 text-gray-600"
                        onClick={closeModal}
                    >
                        <IoIosCloseCircleOutline />
                    </button>

                    <div className="flex items-center gap-1">
                        <img className="rounded-full overflow-hidden" src="" width={16} height={16} alt="" />
                        Debasish Kisan
                    </div>
                </div>


                <img className="w-full h-64 object-contain mb-4" src="login.jpg" alt={data.title} />

                <div className="flex items-center justify-center gap-3 mb-4">


                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-max text-nowrap flex items-center gap-1 text-xs">

                        {data.userReaction === 'like' && <button
                            onClick={() => reactionHandler(data.id, 'dislike')}
                            disabled={isReacting}
                            className="hover:scale-110">
                            <BiSolidLike color="green" />
                        </button>}

                        {data.userReaction === 'dislike' && <button
                            onClick={() => reactionHandler(data.id, 'like')}
                            disabled={isReacting}
                            className="hover:scale-110">
                            <BiSolidDislike color="red" />
                        </button>}

                        {!data.userReaction &&
                            <button
                                onClick={() => reactionHandler(data.id, 'like')}
                                disabled={isReacting}
                                className="hover:scale-110">
                                <BiLike />
                            </button>
                        }


                        <span className="font-semibold text-xs">{data.likes}</span>


                    </div>
                </div>

                <p className="text-xl font-semibold ">{data.title}</p>

                <p className="text-xs font-sans indent-3">{data.content}</p>
            </div>
        </motion.div>
    );
}

export default memo(SinglePostView);
