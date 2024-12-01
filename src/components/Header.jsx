function Header({onLogout}) {

    const scrollToFooter = () => {
        const footerElement = document.getElementById("footer");
        if (footerElement) {
            footerElement.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <div className="header">
            <h1>Твоя парковка</h1>
            <nav>
                <button onClick={onLogout}>вход</button>
                {<button onClick={scrollToFooter}>контакты</button>}
            </nav>
        </div>
    );
};

export default Header;