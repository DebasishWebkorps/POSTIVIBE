import { memo, useState } from "react"
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { postReaction } from "../services/apiServices";
import { motion } from 'framer-motion'

function CardElement(props) {
    const { data } = props
    const [isReacting, setIsReacting] = useState(false)

    console.log('id', data.id)

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

    return (
        <div className="my-4 pt-3 relative mx-auto w-2/4 rounded-md shadow-md bg-gradient-to-r from-blue-600 to-violet-600 text-white overflow-hidden">

            <div className="flex justify-center">
                <p className="underline">{data.title}</p>
            </div>

            <p className="pb-3 px-4">{data.content}</p>


            <div
                className="w-20 text-nowrap flex items-center justify-center gap-2 absolute right-0 bottom-0 mt-2 text-xs rounded-md p-2 shadow-md bg-gradient-to-r from-yellow-400 to-orange-500">

                {data.userReaction === 'like' && <span>
                    <BiSolidLike size={20} />
                </span>}

                {!data.userReaction &&
                    <button
                        onClick={() => reactionHandler(data.id, 'like')}
                        disabled={isReacting}
                        className="shadow-md hover:scale-110">
                        <BiLike size={20} />
                    </button>
                }

                {(data.userReaction === 'dislike') && <button
                    onClick={() => reactionHandler(data.id, 'like')}
                    disabled={isReacting}
                    className="shadow-md hover:scale-110">
                    <BiLike size={20} />
                </button>}

                <span className="font-semibold">{data.likes}</span>

                {(data.userReaction === 'like' && data.likes >= 1) && <button
                    onClick={() => reactionHandler(data.id, 'dislike')}
                    disabled={isReacting}
                    className="shadow-md hover:scale-110">
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
                        className="shadow-md hover:scale-110">
                        <BiDislike size={20} />
                    </button>
                }

                {data.userReaction === 'dislike' && <span>
                    <BiSolidDislike size={20} />
                </span>}

            </div>


        </div >
    )
}

export default memo(CardElement)