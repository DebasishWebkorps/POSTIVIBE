import { memo, useState } from "react"
import { BiLike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { postReaction } from "../services/apiServices";
import SinglePostView from "./SinglePostView";
import { toast } from "react-toastify";

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
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsReacting(false)
        }


    }


    return (
        <div
            onClick={openModal}
            className="rounded-md h-[400px] shadow-md p-2 border border-[#b5bec4] overflow-hidden grid grid-rows-[auto,1fr,60px] hover:shadow-lg bg-transparent transition-colors duration-300">


            <div className="flex items-center gap-1">
                <img className="rounded-full overflow-hidden" src={data.userImage} width={16} height={16} alt="" />
                <h2>{data.userName}</h2>
            </div>

            <div className="flex flex-col justify-between">

                <img loading="lazy" className="w-full h-full object-contain" src={data.image} alt="" />

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
            <div className="">
                <p className="text-sm font-bold">{data.title}</p>
                <p className="text-xs font-sans text-wrap truncate line-clamp-2 mb-2"> {data.content} </p>
            </div>
            {isModalOpen && <SinglePostView data={data} closeModal={closeModal} />}
        </div >

    )
}

export default memo(CardElement)