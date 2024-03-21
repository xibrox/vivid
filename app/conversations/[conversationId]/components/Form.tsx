"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";

import { CldUploadButton } from "next-cloudinary";
import MessageInput from "./MessageInput";

const Form = () => {
    const { conversationId } = useConversation();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            message: '',
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true });

        axios.post('/api/messages', {
            ...data,
            conversationId,
        });
    };

    const handleUpload = (result: any) => {
        axios.post('/api/messages', {
            image: result?.info?.secure_url,
            conversationId,
        });
    }

    return (
        <div
            className="
                py-4
                px-4
                bg-white
                border-t
                flex
                items-center
                gap-2
                lg:gap-4
                w-full
            "
        >
            <CldUploadButton
                options={{ maxFiles: 1 }}
                onUpload={handleUpload}
                uploadPreset="i6pbckqm"
            >
                <HiPhoto size={30} className="text-violet-500" />
            </CldUploadButton>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2 lg:gap-4 w-full"
            >
                <MessageInput
                    id="message"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Napsat zprávu"
                />
                <button
                    type="submit"
                    className="
                        rounded-full
                        p-2
                        bg-violet-500
                        hover:bg-violet-600
                        cursor-pointer
                        transition
                    "
                >
                    <HiPaperAirplane 
                        size={18}
                        className="text-white"
                    />
                </button>
            </form>
        </div>
    );
};

export default Form;