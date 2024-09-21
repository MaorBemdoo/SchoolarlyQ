import Image from "next/image"
import Link from "next/link"
// import { FaGithub } from "react-icons/fa6"

const Header = () => {
    return (
        <header className="flex justify-between items-center p-4">
            <div className="flex items-center gap-1"><Image src="/favicon.ico" alt="Logo image" width={25} height={25}/>SchoolarlyQ</div>
            <div className="flex items-center gap-5">
                {/* <a href="https://github.com/MaorBemdoo/ScoolarlyQ"><FaGithub className="text-2xl"/></a> */}
                <Link href="/about">About</Link>
                <Link href="#contact">Contact</Link>
            </div>
        </header>
    )
}
export default Header