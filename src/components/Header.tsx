import Image from "next/image"
import Link from "next/link"
import { FaGithub } from "react-icons/fa6"

const Header = () => {
    return (
        <header className="container flex justify-between items-center p-4">
            <div className="flex items-center gap-5">
                <Image src="/favicon.ico" alt="Logo image" width={25} height={25}/>
                <Link href="/discover">Discover</Link>
                <Link href="/about">About</Link>
                <Link href="#contact">Contact</Link>
            </div>
            <div className="flex items-center gap-5">
                <Link href="https://github.com/MaorBemdoo/ScoolarlyQ"><FaGithub className="text-2xl"/></Link>
                <Link href="/auth/login"><button>Login</button></Link>
                <Link href="/auth/register"><button>Register</button></Link>
            </div>
        </header>
    )
}
export default Header