

function Memories() {

    const images = Array.from({ length: 194 }, (_, i) =>
        `/images/relive/scraped_image_${String(i + 1).padStart(4, "0")}.jpg`
    );
    return (
        <>
            <h1 className="font-bold text-3xl mt-10 mb-20 text-center">RELIVE</h1>

            <div className="flex justify-around flex-wrap items-center md:px-40 px-6 gap-4">
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`scraped ${index + 1}`}
                        className="h-80 w-80"
                    />
                ))}

            </div>
        </>
    )
}

export default Memories;