import { memo, useState } from "react";
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { postReaction } from "../services/apiServices";
import { motion } from "framer-motion";

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
            className="fixed inset-0 backdrop-blur-sm  flex justify-center items-center z-50"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div
                className="bg-white rounded-md shadow-lg max-w-lg w-full p-4 relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <button
                    className="absolute top-2 right-2 text-gray-600"
                    onClick={closeModal}
                >
                    X
                </button>

                {/* Title */}
                <p className="underline text-center text-xl font-semibold mb-4">{data.title}</p>

                {/* Image */}
                <img className="w-full h-64 object-contain mb-4" src="login.jpg" alt={data.title} />

                {/* Reactions Section */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    {data.userReaction === "like" ? (
                        <BiSolidLike color="green" size={24} />
                    ) : (
                        <button
                            onClick={() => reactionHandler(data.id, "like")}
                            disabled={isReacting}
                            className="hover:scale-110 transition-transform duration-200"
                        >
                            <BiLike size={24} />
                        </button>
                    )}

                    <span className="font-semibold">{data.likes}</span>

                    {data.userReaction === "dislike" ? (
                        <BiSolidDislike color="red" size={24} />
                    ) : (
                        <button
                            onClick={() => reactionHandler(data.id, "dislike")}
                            disabled={isReacting}
                            className="hover:scale-110 transition-transform duration-200"
                        >
                            <BiDislike size={24} />
                        </button>
                    )}
                </div>

                {/* Post Content */}
                <p className="text-xs font-sans px-2">{data.content}</p>
            </div>
        </motion.div>
    );
}

export default memo(SinglePostView);
