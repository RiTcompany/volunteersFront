import styles from './Footer.module.css'
import classNames from 'classnames'
import React from "react";
const cn = classNames;

export function Footer(): React.JSX.Element {
    return (
        <div className={cn("w-full flex justify-center items-center text-white", styles.footer__container)}>
            <p className={cn("text-[14px] md:text-[18px] mx-2 text-center")}>© Волонтёры Победы. Санкт-Петербургское региональное отделение Всероссийского общественного движения.</p>
        </div>
    )
}
