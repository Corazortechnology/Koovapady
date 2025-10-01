
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="border-b border-gray-400 mt-4 px-16 ml-8 mr-8">
            <div className="flex flex-col items-center justify-between py-4 md:flex-row">

                <div className="flex space-x-4 mb-2 md:mb-0">
                    <Link
                        to="/"
                        className="text-black text-xl hover:text-black font-medium"
                    >
                        Home
                    </Link>
                    <Link
                        to="/feedback"
                        className="text-gray-400 text-xl hover:text-black font-medium"
                    >
                        Feedback
                    </Link>
                </div>

                <h1 className="text-4xl md:ml-[-90px] font-bold text-center text-black">
                    koovappady&apos;s <br></br> kshemalayam
                </h1>
                <div></div>
            </div>
        </footer>
    );
}

export default Footer;
