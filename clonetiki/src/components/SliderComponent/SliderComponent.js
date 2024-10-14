function Slider() {
    return (
        <>
            <div id="demo" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#demo" data-bs-slide-to="0" className="active"></button>
                    <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
                </div>

                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img
                            src="https://cf.shopee.vn/file/vn-50009109-8590a0971a82a1cc86af0a7deb517407_xxhdpi"
                            alt="anh1"
                            className="d-block w-100"
                        />
                    </div>
                    <div className="carousel-item">
                        <img
                            src="https://cf.shopee.vn/file/vn-50009109-0977c05b9751096ad524bb680ae14979_xxhdpi"
                            alt="anh2"
                            className="d-block w-100"
                        />
                    </div>
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
                    <span className="carousel-control-next-icon"></span>
                </button>
            </div>
        </>
    );
}

export default Slider;
