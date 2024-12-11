import { memo, useState } from "react"
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { postReaction } from "../services/apiServices";
import { motion } from 'framer-motion'
import SinglePostView from "./SinglePostView";

function CardElement(props) {
    const { data } = props
    const [isReacting, setIsReacting] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    const reactionHandler = async (id, reaction) => {

        const data = {
            postid: id,
            reaction
        }

        try {
            setIsReacting(true)
            await postReaction(data)
            // props.postReactionHandler(id)
        } catch (error) {
            console.error(error.message)
        } finally {
            setIsReacting(false)
        }


    }
    // return null
    return (
        <div
            onClick={openModal}
            className="rounded-md shadow-md border border-[#b5bec4] overflow-hidden grid grid-rows-[20px,1fr,40px] gap-2 hover:bg-white bg-transparent transition-colors duration-300">

            {/* <div className="flex justify-center"> */}
            <p className="underline text-center">{data.title}</p>
            {/* </div> */}

            <div className="flex flex-col">

                <img className="w-full h-full object-contain" src="login.jpg" alt="" />

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 text-nowrap flex items-center gap-1 text-xs">

                    {data.userReaction === 'like' && <span>
                        <BiSolidLike color="green" size={20} />
                    </span>}

                    {!data.userReaction &&
                        <button
                            onClick={() => reactionHandler(data.id, 'like')}
                            disabled={isReacting}
                            className="hover:scale-110">
                            <BiLike size={20} />
                        </button>
                    }

                    {(data.userReaction === 'dislike') && <button
                        onClick={() => reactionHandler(data.id, 'like')}
                        disabled={isReacting}
                        className="hover:scale-110">
                        <BiLike size={20} />
                    </button>}

                    <span className="font-semibold">{data.likes}</span>

                    {(data.userReaction === 'like' && data.likes >= 1) && <button
                        onClick={() => reactionHandler(data.id, 'dislike')}
                        disabled={isReacting}
                        className="hover:scale-110">
                        <BiDislike size={20} />
                    </button>}

                    {(!data.userReaction && data.likes === 0) && <span>
                        <BiDislike size={20} />
                    </span>}

                    {(data.userReaction === 'like' && data.likes === 0) && <span>
                        <BiDislike size={20} />
                    </span>}

                    {(!data.userReaction && data.likes >= 1) &&
                        <button
                            onClick={() => reactionHandler(data.id, 'dislike')}
                            disabled={isReacting}
                            className="hover:scale-110">
                            <BiDislike size={20} />
                        </button>
                    }

                    {data.userReaction === 'dislike' && <span>
                        <BiSolidDislike color="red" size={20} />
                    </span>}

                </div>
            </div>


            <p className="text-xs font-sans px-2">{data.content}</p>
            {isModalOpen && <SinglePostView data={data} closeModal={closeModal} />}
        </div >
    )
}

export default memo(CardElement)