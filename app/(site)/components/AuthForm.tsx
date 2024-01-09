"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";

import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>("LOGIN");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.status === "authenticated") {
            router.push("/users");
        }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
        setVariant(() => {
            return variant === "LOGIN" ? "REGISTER" : "LOGIN";
        });
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        register('password', {
            required: 'Je vyžadováno heslo',
            minLength: {
                value: 8,
                message: 'Heslo musí mít alespoň 8 znaků',
            },
            validate: value => !value.includes(' ') || 'Mezery nejsou povoleny',
        });

        register('email', {
            required: 'Je vyžadován E-mail',
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Prosím zadejte platnou emailovou adresu',
            },
        });
    }, [register]);

    const onSubmit: SubmitHandler<FieldValues> = ((data: any) => {
        setIsLoading(true);

        if (variant === "REGISTER") {
            axios.post("/api/register", data)
            .then(() => signIn("credentials", data))
            .catch(() => toast.error("Něco se pokazilo!"))
            .finally(() => setIsLoading(false));
        }

        if (variant === "LOGIN") {
            signIn("credentials", {
                ...data,
                redirect: false,
            }).then((callback) => {
                if (callback?.error) {
                    toast.error('Neplatné přihlašovací údaje!');
                }

                if (callback?.ok && !callback?.error) {
                    toast.success('Přihlášen!');
                    router.push("/users");
                }
            }).finally(() => setIsLoading(false));
        }
    });

    const socialAction = (action: string) => {
        setIsLoading(true);

        signIn(action, {
            redirect: false,
        }).then((callback) => {
            if (callback?.error) {
                toast.error('Neplatné přihlašovací údaje!');
            }

            if (callback?.ok && !callback?.error) {
                toast.success('Přihlášen!');
            }
        }
        ).finally(() => setIsLoading(false));
    }

    return (
        <div 
            className="
                mt-8
                sm:mx-auto
                sm:w-full
                sm:max-w-md
            "
        >
            <div 
                className="
                    bg-white
                    px-4
                    py-8
                    shadow
                    sm:rounded-lg
                    sm:px-10
                "
            >
                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {variant === "REGISTER" && (
                        <Input 
                            id="name" 
                            label="Jméno" 
                            register={register}
                            errors={errors}
                            disabled={isLoading}
                        />
                    )}
                    <div>
                        <Input 
                            id="email" 
                            label="Email"
                            type="email" 
                            register={register}
                            errors={errors}
                            disabled={isLoading}
                        />
                        {errors.email?.type === 'pattern' && (
                            <p className="text-sm text-red-500">Prosím zadejte platnou emailovou adresu</p>
                        )}
                    </div>
                    <div>
                        <Input 
                            id="password" 
                            label="Heslo"
                            type="password"
                            register={register}
                            errors={errors}
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password.message && (
                                    errors.password.type === 'minLength' ? 'Heslo musí mít alespoň 8 znaků' : 'Mezery nejsou povoleny'
                                )}
                            </p>
                        )}
                    </div>
                    <div>
                        <Button
                            disabled={isLoading}
                            fullWidth
                            type="submit"
                        >
                            {variant === "LOGIN" ? "Přihlásit se" : "Registrovat se"}
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Nebo pokračovat s
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton 
                            icon={BsGithub}
                            onClick={() => socialAction("github")}
                        />
                        <AuthSocialButton 
                            icon={BsGoogle}
                            onClick={() => socialAction("google")}
                        />
                    </div>
                </div>

                <div className="
                    flex
                    gap-2
                    justify-center
                    text-sm
                    mt-6
                    px-2
                    text-gray-500
                ">
                    <div>
                        {variant === "LOGIN" ? "Nový v Vivid Chat?" : "Máte již účet?"}
                    </div>
                    <div
                        onClick={toggleVariant}
                        className="underline cursor-pointer"
                    >
                        {variant === "LOGIN" ? "Vytvořit účet" : "Přihlásit se"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;