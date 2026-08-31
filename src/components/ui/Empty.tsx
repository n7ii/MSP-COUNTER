import { FC, HTMLProps } from "react"
import { motion } from "framer-motion"


import { HiOutlineInbox } from "react-icons/hi2"

type Props = {
    text?: string
} & HTMLProps<HTMLDivElement>

const Empty: FC<Props> = ({ text }) => {
    return (
        <motion.div
            className="mt-5 flex flex-1 flex-col items-center justify-center px-4 md:mt-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 10 }} // Reduced delay
        >
            <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed
        border-gray-300 bg-gray-100 p-12 text-secondary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }} // Reduced delay
            >
                <HiOutlineInbox className="absolute h-10 w-10 text-gray-400" />
            </motion.div>
            <motion.h2
                className="pt-6 text-center text-2xl font-bold tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }} // Reduced delay
            >
                ບໍ່ມີຂໍ້ມູນ
            </motion.h2>
            <motion.p
                className="text-accents-3 px-10 pb-6 pt-2 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }} // Reduced delay
            >
                {text}
            </motion.p>
        </motion.div>
    )
}

export default Empty
