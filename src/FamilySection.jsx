
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FamilySection = () => {
    const [activeSection, setActiveSection] = useState(null);

    const sections = [
        {
            id: 1,
            title: 'the house',
            subtitle: 'ENTER',
            year: '2020',
            image: 'https://plus.unsplash.com/premium_photo-1661475916373-5aaaeb4a5393?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5fGVufDB8fDB8fHww',
            align: 'left',
            link: '/house',
        },
        {
            id: 2,
            title: 'the grand parents',
            subtitle: 'GOLDIES',
            year: '2020',
            image: 'https://plus.unsplash.com/premium_photo-1661475916373-5aaaeb4a5393?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5fGVufDB8fDB8fHww',
            align: 'right',
            link: "/grandparents"
        },
        {
            id: 3,
            title: 'the cousins',
            subtitle: 'WE & US',
            year: '2020',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
            align: 'left',
            link: "/cousins"
        },
        {
            id: 4,
            title: 'the memories',
            subtitle: 'RELIVE',
            year: '2020',
            image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
            align: 'right',
            link: "/memories"
        },
        {
            id: 5,
            title: 'the happiness',
            subtitle: 'Know',
            year: '2020',
            image: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800&h=600&fit=crop',
            align: 'left',
            link: "/happiness"
        },
        {
            id: 6,
            title: 'the events',
            subtitle: 'KEY DATES',
            year: '2020',
            image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop',
            align: 'right',
            link: "/events"
        },
        {
            id: 7,
            title: 'the fun & fast',
            subtitle: 'ENJOY',
            year: '2022',
            image: 'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=800&h=600&fit=crop',
            align: 'left',
            link: "/fun"
        }
    ];
    const navigate = useNavigate();
    const handleClick = (link) => {
        console.log('Navigating to:', link);
        navigate(link)
    };

    return (
        <div className="min-h-screen mt-30 md:px-30 px-6">
            <h1 className="text-center md:text-6xl font-bold text-2xl text-black">Hi, this is thekkemadom <br></br>kshemalayam's official site!
            </h1>
            <p className="text-center text-2xl text-gray-400 mb-30 mt-8">Scroll down to see more</p>

            {sections.map((section) => (
                <div
                    key={section.id}
                    className={`flex flex-col h-120 ${section.align === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
                        } w-full`}
                >
                    <div
                        onClick={() => handleClick(section.link)}
                        className="relative w-full md:w-1/2 h-96 md:h-screen overflow-hidden group cursor-pointer"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 h-120 group-hover:scale-110"
                            style={{
                                backgroundImage: `url(${section.image})`
                            }}
                        />

                        <div className="absolute inset-0 bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300" />

                        <div className="relative z-10 h-96 flex flex-col justify-center items-start p-8">
                            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                                {section.title}
                            </h2>

                            <button className="group/btn bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full flex items-center gap-3 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                                {section.subtitle}
                                <svg
                                    className="w-5 h-5 transform group-hover/btn:translate-x-2 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div
                        onClick={() => handleClick(section.link)}
                        className="relative w-full md:w-1/2 bg-gray-200 flex flex-col justify-center items-center p-8 md:p-16 cursor-pointer group hover:bg-black transition-colors duration-300"
                    >
                        <div className="text-center max-w-md">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 group-hover:text-white transition-colors duration-300">
                                {section.subtitle}
                            </h3>

                            <p className="text-gray-500 text-lg mb-8">{section.year}</p>


                            <div className="mt-8 w-20 h-1 bg-pink-500 mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

};

export default FamilySection;