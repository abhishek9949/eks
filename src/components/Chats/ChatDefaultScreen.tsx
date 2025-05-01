import { ChatDefaultScreenProps } from "@/types/chats";
import Image from "next/image";
import React from "react";

const ChatDefaultScreen = ({
  text,
  description
}: ChatDefaultScreenProps) => {
  return (
    <div className="relative flex flex-col justify-center items-center h-full gap-10 text-center w-full overflow-hidden">
      <Image
        src={"/svg/chat-main-screen.svg"}
        alt="chat main screen"
        width={350}
        height={423}
        className="max-h-[30vh] object-contain"
      />
      <div className="flex flex-col gap-1">
        <p className="text-xl xl:text-2xl font-medium leading-7 text-black">
          {text}
        </p>
        <p className="text-sm xl:text-lg font-light leading-7 text-black">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ChatDefaultScreen;
