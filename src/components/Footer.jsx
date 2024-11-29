function Footer(props) {
    return (
        <div className="footer" id="footer">
            <hr style={{ marginBottom: '20px' }}/>
            <div className="footer-info">
                <div className="contacts">
                    <a href="tel:+79777282066">Служба поддержки</a>
                    <a href="mailto:slobodjanjuk.a.a@edu.mirea.ru">Напишите нам</a>
                </div>
                <div className="foundation-address">
                    <p>г. Москва, пр. Вернадского, 78</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;