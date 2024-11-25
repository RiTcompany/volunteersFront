import styles from './Main.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
const cn = classNames;

export function Main(): React.JSX.Element {
    const [page, setPage] = useState<string>("default");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loginData, setLoginData] = useState<{username: string, password: string}>({
        username: "",
        password: ""
    })
    const [error, setError] = useState<string>("")
    const navigate = useNavigate()
    const handleLoginButton = () => {
        setPage("login")
    }

    const handleLoginDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({...loginData, [e.target.name] : e.target.value})
    }

    useEffect(() => {
        localStorage.getItem("authToken") && navigate("/profile")
    })

    const handleSubmit = async () => {
        if (!loginData.username || !loginData.password) {
            setError("Заполните, пожалуйста, все поля")
            return
        }
        // localStorage.setItem("auth", "true");
        // navigate("/profile")
        try {
            const response = await fetch("https://rit-test.ru/api/v1/auth/sign-in", {
                method: "POST",
                body: JSON.stringify(loginData),
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })
            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem('authToken', responseData.token);
                // window.location.hash=`#/profile/`
                navigate("/profile")
                // const token = responseData.token;
                // const data = parseJwt(token);
                // if (data && data.id && localStorage.getItem('authToken')) {
                //     window.location.hash=`#/profile/${data.id}`
                //     window.location.reload();
                // } else {
                //     console.error('Invalid token data:', data);
                // }
            } else {
                console.error('Sign-in failed:', response.statusText);
            }}
        catch (error) {
            console.log(error)
        }
    }
    // useEffect(() => {
    //     console.log(loginData)
    // }, [loginData]);
    return (
        <div className={cn("h-full bg-cover mx-auto my-0 flex w-full", styles.main__container)}
             style={page === "default" ? {backgroundColor: "rgba(12, 66, 140, 0.7)"} :
                 {backgroundColor: "rgba(12, 66, 140, 0.1)"}}>
            {page === "default" &&
                <div className={cn("flex flex-col justify-center mx-auto my-0 items-center text-white gap-8 md:gap-8")}>
                    <h3 className={cn(styles.main__title)}>АДМИНИСТРАТИВНЫЙ САЙТ</h3>
                    <hr className={cn(styles.main__line)}/>
                    <div className={cn("flex flex-col items-center")}>
                        <h1 className={cn(styles.main__subtitle)}>ВОЛОНТЁРЫ ПОБЕДЫ</h1>
                        <p className={cn(styles.main__text)}>Санкт-Петербургское региональное отделение Всероссийского общественного движения</p>
                    </div>
                    <button className={cn(styles.main__button)} onClick={handleLoginButton}>Войти</button>
                </div>
            }
            {page === "login" &&
                <div className={cn("flex flex-col justify-center gap-12 md:gap-0 md:justify-between mx-auto my-0 items-center text-white p-10", styles.main__login)}>
                    <h3 className={cn("text-[32px]")}>Авторизация</h3>
                    <label className={"flex flex-col w-full"}>
                        Логин
                        <input placeholder="Введите Ваш логин" className={cn(styles.main__loginInput)}
                               name="username" onChange={handleLoginDataChange}/>
                    </label>
                    <label className={"flex flex-col w-full relative"}>
                        Пароль
                        <input placeholder="Введите Ваш пароль" type={showPassword ? "text" : "password"}
                               className={cn(styles.main__loginInput)} style={{paddingRight: "50px"}}
                               name="password" onChange={handleLoginDataChange}/>
                        <button type="button" onClick={() => setShowPassword(prev => !prev)}
                                className="password-toggle-button absolute right-4 top-12">
                            {showPassword ? <span className="material-symbols-outlined">visibility_off</span>
                                : <span className="material-symbols-outlined">visibility</span>}
                        </button>
                        <div className={cn(styles.main__errorContainer)}>
                            {error && <div className={cn("mt-2 ml-1")}>{error}</div>}
                        </div>

                    </label>
                    <button className={cn("w-full", styles.main__loginButton)} onClick={handleSubmit}>Войти</button>
                </div>
            }
        </div>
    )
}
