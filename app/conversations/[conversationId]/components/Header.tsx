"use client";

import { Conversation, User } from "@prisma/client";

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";

import ProfileDrawer from "./ProfileDrawer";

interface HeaderProps {
    conversation: Conversation & {
        users: User[];
    };
};

const Header: React.FC<HeaderProps> = ({
    conversation
}) => {
    const otherUser = useOtherUser(conversation);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`;
        }

        return 'Online';
    }, [conversation]);

    return (
        <>
            <ProfileDrawer 
                data={conversation}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
            <div
                className="
                    bg-white
                    w-full
                    flex
                    border-b-[1px]
                    sm:px-4
                    py-3
                    px-4
                    lg:px-6
                    justify-between
                    items-center
                    shadow-sm
                "
            >
                <div className="flex gap-3 items-center">
                    <Link 
                        className="
                            lg:hidden
                            block
                            text-violet-500
                            hover:text-violet-600
                            transition
                            cursor-pointer
                        "
                        href="/conversations"
                    >
                        <HiChevronLeft size={32} />
                    </Link>
                    <Avatar user={otherUser} />
                    <div className="flex flex-col">
                        <div>
                            {conversation.name || otherUser.name}
                        </div>
                        <div
                            className="
                                text-sm
                                font-light
                                text-gray-500
                            "
                        >
                            {statusText}
                        </div>
                    </div>
                </div>
                <HiEllipsisHorizontal 
                    size={32} 
                    onClick={() => setDrawerOpen(true)} 
                    className="
                        text-violet-500
                        hover:text-violet-600
                        transition
                        cursor-pointer
                    "
                />
            </div>
        </>
    );
};

export default Header;