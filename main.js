/* ============================================
   SEM VERGONHA | COMING SOON
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Country Data (all countries) ─────────────
    const countries = [
        // Portugal first (default)
        { name: 'Portugal', code: '+351', flag: '\u{1F1F5}\u{1F1F9}', digits: 9 },
        // A
        { name: 'Afeganist\u00e3o', code: '+93', flag: '\u{1F1E6}\u{1F1EB}', digits: 9 },
        { name: '\u00c1frica do Sul', code: '+27', flag: '\u{1F1FF}\u{1F1E6}', digits: 9 },
        { name: 'Alb\u00e2nia', code: '+355', flag: '\u{1F1E6}\u{1F1F1}', digits: 9 },
        { name: 'Alemanha', code: '+49', flag: '\u{1F1E9}\u{1F1EA}', digits: [10, 11] },
        { name: 'Andorra', code: '+376', flag: '\u{1F1E6}\u{1F1E9}', digits: 6 },
        { name: 'Angola', code: '+244', flag: '\u{1F1E6}\u{1F1F4}', digits: 9 },
        { name: 'Ant\u00edgua e Barbuda', code: '+1268', flag: '\u{1F1E6}\u{1F1EC}', digits: 7 },
        { name: 'Ar\u00e1bia Saudita', code: '+966', flag: '\u{1F1F8}\u{1F1E6}', digits: 9 },
        { name: 'Arg\u00e9lia', code: '+213', flag: '\u{1F1E9}\u{1F1FF}', digits: 9 },
        { name: 'Argentina', code: '+54', flag: '\u{1F1E6}\u{1F1F7}', digits: 10 },
        { name: 'Arm\u00e9nia', code: '+374', flag: '\u{1F1E6}\u{1F1F2}', digits: 8 },
        { name: 'Austr\u00e1lia', code: '+61', flag: '\u{1F1E6}\u{1F1FA}', digits: 9 },
        { name: '\u00c1ustria', code: '+43', flag: '\u{1F1E6}\u{1F1F9}', digits: [10, 11] },
        { name: 'Azerbaij\u00e3o', code: '+994', flag: '\u{1F1E6}\u{1F1FF}', digits: 9 },
        // B
        { name: 'Bahamas', code: '+1242', flag: '\u{1F1E7}\u{1F1F8}', digits: 7 },
        { name: 'Bahrein', code: '+973', flag: '\u{1F1E7}\u{1F1ED}', digits: 8 },
        { name: 'Bangladesh', code: '+880', flag: '\u{1F1E7}\u{1F1E9}', digits: 10 },
        { name: 'Barbados', code: '+1246', flag: '\u{1F1E7}\u{1F1E7}', digits: 7 },
        { name: 'B\u00e9lgica', code: '+32', flag: '\u{1F1E7}\u{1F1EA}', digits: 9 },
        { name: 'Belize', code: '+501', flag: '\u{1F1E7}\u{1F1FF}', digits: 7 },
        { name: 'Benim', code: '+229', flag: '\u{1F1E7}\u{1F1EF}', digits: 8 },
        { name: 'Bielorr\u00fassia', code: '+375', flag: '\u{1F1E7}\u{1F1FE}', digits: 10 },
        { name: 'Bol\u00edvia', code: '+591', flag: '\u{1F1E7}\u{1F1F4}', digits: 8 },
        { name: 'B\u00f3snia e Herzegovina', code: '+387', flag: '\u{1F1E7}\u{1F1E6}', digits: 8 },
        { name: 'Botsuana', code: '+267', flag: '\u{1F1E7}\u{1F1FC}', digits: 8 },
        { name: 'Brasil', code: '+55', flag: '\u{1F1E7}\u{1F1F7}', digits: 11 },
        { name: 'Brunei', code: '+673', flag: '\u{1F1E7}\u{1F1F3}', digits: 7 },
        { name: 'Bulg\u00e1ria', code: '+359', flag: '\u{1F1E7}\u{1F1EC}', digits: 9 },
        { name: 'Burkina Faso', code: '+226', flag: '\u{1F1E7}\u{1F1EB}', digits: 8 },
        { name: 'Burundi', code: '+257', flag: '\u{1F1E7}\u{1F1EE}', digits: 8 },
        { name: 'But\u00e3o', code: '+975', flag: '\u{1F1E7}\u{1F1F9}', digits: 8 },
        // C
        { name: 'Cabo Verde', code: '+238', flag: '\u{1F1E8}\u{1F1FB}', digits: 7 },
        { name: 'Camar\u00f5es', code: '+237', flag: '\u{1F1E8}\u{1F1F2}', digits: 9 },
        { name: 'Camboja', code: '+855', flag: '\u{1F1F0}\u{1F1ED}', digits: 9 },
        { name: 'Canad\u00e1', code: '+1', flag: '\u{1F1E8}\u{1F1E6}', digits: 10 },
        { name: 'Catar', code: '+974', flag: '\u{1F1F6}\u{1F1E6}', digits: 8 },
        { name: 'Cazaquist\u00e3o', code: '+7', flag: '\u{1F1F0}\u{1F1FF}', digits: 10 },
        { name: 'Chade', code: '+235', flag: '\u{1F1F9}\u{1F1E9}', digits: 8 },
        { name: 'Chile', code: '+56', flag: '\u{1F1E8}\u{1F1F1}', digits: 9 },
        { name: 'China', code: '+86', flag: '\u{1F1E8}\u{1F1F3}', digits: 11 },
        { name: 'Chipre', code: '+357', flag: '\u{1F1E8}\u{1F1FE}', digits: 8 },
        { name: 'Col\u00f4mbia', code: '+57', flag: '\u{1F1E8}\u{1F1F4}', digits: 10 },
        { name: 'Comores', code: '+269', flag: '\u{1F1F0}\u{1F1F2}', digits: 7 },
        { name: 'Congo', code: '+242', flag: '\u{1F1E8}\u{1F1EC}', digits: 9 },
        { name: 'Coreia do Norte', code: '+850', flag: '\u{1F1F0}\u{1F1F5}', digits: [10, 11] },
        { name: 'Coreia do Sul', code: '+82', flag: '\u{1F1F0}\u{1F1F7}', digits: [10, 11] },
        { name: 'Costa do Marfim', code: '+225', flag: '\u{1F1E8}\u{1F1EE}', digits: 10 },
        { name: 'Costa Rica', code: '+506', flag: '\u{1F1E8}\u{1F1F7}', digits: 8 },
        { name: 'Cro\u00e1cia', code: '+385', flag: '\u{1F1ED}\u{1F1F7}', digits: 9 },
        { name: 'Cuba', code: '+53', flag: '\u{1F1E8}\u{1F1FA}', digits: 8 },
        // D
        { name: 'Dinamarca', code: '+45', flag: '\u{1F1E9}\u{1F1F0}', digits: 8 },
        { name: 'Djibuti', code: '+253', flag: '\u{1F1E9}\u{1F1EF}', digits: 8 },
        { name: 'Dominica', code: '+1767', flag: '\u{1F1E9}\u{1F1F2}', digits: 7 },
        // E
        { name: 'Egito', code: '+20', flag: '\u{1F1EA}\u{1F1EC}', digits: 10 },
        { name: 'El Salvador', code: '+503', flag: '\u{1F1F8}\u{1F1FB}', digits: 8 },
        { name: 'Emirados \u00c1rabes Unidos', code: '+971', flag: '\u{1F1E6}\u{1F1EA}', digits: 9 },
        { name: 'Equador', code: '+593', flag: '\u{1F1EA}\u{1F1E8}', digits: 9 },
        { name: 'Eritreia', code: '+291', flag: '\u{1F1EA}\u{1F1F7}', digits: 7 },
        { name: 'Eslov\u00e1quia', code: '+421', flag: '\u{1F1F8}\u{1F1F0}', digits: 9 },
        { name: 'Eslov\u00e9nia', code: '+386', flag: '\u{1F1F8}\u{1F1EE}', digits: 8 },
        { name: 'Espanha', code: '+34', flag: '\u{1F1EA}\u{1F1F8}', digits: 9 },
        { name: 'EUA', code: '+1', flag: '\u{1F1FA}\u{1F1F8}', digits: 10 },
        { name: 'Est\u00f3nia', code: '+372', flag: '\u{1F1EA}\u{1F1EA}', digits: [7, 8] },
        { name: 'Eti\u00f3pia', code: '+251', flag: '\u{1F1EA}\u{1F1F9}', digits: 9 },
        // F
        { name: 'Fiji', code: '+679', flag: '\u{1F1EB}\u{1F1EF}', digits: 7 },
        { name: 'Filipinas', code: '+63', flag: '\u{1F1F5}\u{1F1ED}', digits: 10 },
        { name: 'Finl\u00e2ndia', code: '+358', flag: '\u{1F1EB}\u{1F1EE}', digits: [9, 10] },
        { name: 'Fran\u00e7a', code: '+33', flag: '\u{1F1EB}\u{1F1F7}', digits: 9 },
        // G
        { name: 'Gab\u00e3o', code: '+241', flag: '\u{1F1EC}\u{1F1E6}', digits: 7 },
        { name: 'G\u00e2mbia', code: '+220', flag: '\u{1F1EC}\u{1F1F2}', digits: 7 },
        { name: 'Gana', code: '+233', flag: '\u{1F1EC}\u{1F1ED}', digits: 9 },
        { name: 'Ge\u00f3rgia', code: '+995', flag: '\u{1F1EC}\u{1F1EA}', digits: 9 },
        { name: 'Gr\u00e9cia', code: '+30', flag: '\u{1F1EC}\u{1F1F7}', digits: 10 },
        { name: 'Guatemala', code: '+502', flag: '\u{1F1EC}\u{1F1F9}', digits: 8 },
        { name: 'Guin\u00e9', code: '+224', flag: '\u{1F1EC}\u{1F1F3}', digits: 9 },
        { name: 'Guin\u00e9-Bissau', code: '+245', flag: '\u{1F1EC}\u{1F1FC}', digits: 7 },
        { name: 'Guin\u00e9 Equatorial', code: '+240', flag: '\u{1F1EC}\u{1F1F6}', digits: 9 },
        { name: 'Guiana', code: '+592', flag: '\u{1F1EC}\u{1F1FE}', digits: 7 },
        // H
        { name: 'Haiti', code: '+509', flag: '\u{1F1ED}\u{1F1F9}', digits: 8 },
        { name: 'Honduras', code: '+504', flag: '\u{1F1ED}\u{1F1F3}', digits: 8 },
        { name: 'Hungria', code: '+36', flag: '\u{1F1ED}\u{1F1FA}', digits: 9 },
        // I
        { name: '\u00cdndia', code: '+91', flag: '\u{1F1EE}\u{1F1F3}', digits: 10 },
        { name: 'Indon\u00e9sia', code: '+62', flag: '\u{1F1EE}\u{1F1E9}', digits: [10, 12] },
        { name: 'Iraque', code: '+964', flag: '\u{1F1EE}\u{1F1F6}', digits: 10 },
        { name: 'Ir\u00e3o', code: '+98', flag: '\u{1F1EE}\u{1F1F7}', digits: 10 },
        { name: 'Irlanda', code: '+353', flag: '\u{1F1EE}\u{1F1EA}', digits: [9, 10] },
        { name: 'Isl\u00e2ndia', code: '+354', flag: '\u{1F1EE}\u{1F1F8}', digits: 7 },
        { name: 'Israel', code: '+972', flag: '\u{1F1EE}\u{1F1F1}', digits: 9 },
        { name: 'It\u00e1lia', code: '+39', flag: '\u{1F1EE}\u{1F1F9}', digits: 10 },
        // J
        { name: 'Jamaica', code: '+1876', flag: '\u{1F1EF}\u{1F1F2}', digits: 7 },
        { name: 'Jap\u00e3o', code: '+81', flag: '\u{1F1EF}\u{1F1F5}', digits: 10 },
        { name: 'Jord\u00e2nia', code: '+962', flag: '\u{1F1EF}\u{1F1F4}', digits: 9 },
        // K
        { name: 'Qu\u00e9nia', code: '+254', flag: '\u{1F1F0}\u{1F1EA}', digits: 10 },
        { name: 'Kuwait', code: '+965', flag: '\u{1F1F0}\u{1F1FC}', digits: 8 },
        { name: 'Quirguist\u00e3o', code: '+996', flag: '\u{1F1F0}\u{1F1EC}', digits: 9 },
        // L
        { name: 'Laos', code: '+856', flag: '\u{1F1F1}\u{1F1E6}', digits: 10 },
        { name: 'Let\u00f3nia', code: '+371', flag: '\u{1F1F1}\u{1F1FB}', digits: 8 },
        { name: 'L\u00edbano', code: '+961', flag: '\u{1F1F1}\u{1F1E7}', digits: [7, 8] },
        { name: 'Lib\u00e9ria', code: '+231', flag: '\u{1F1F1}\u{1F1F7}', digits: [7, 8] },
        { name: 'L\u00edbia', code: '+218', flag: '\u{1F1F1}\u{1F1FE}', digits: 10 },
        { name: 'Liechtenstein', code: '+423', flag: '\u{1F1F1}\u{1F1EE}', digits: 7 },
        { name: 'Litu\u00e2nia', code: '+370', flag: '\u{1F1F1}\u{1F1F9}', digits: 8 },
        { name: 'Luxemburgo', code: '+352', flag: '\u{1F1F1}\u{1F1FA}', digits: 9 },
        // M
        { name: 'Maced\u00f3nia do Norte', code: '+389', flag: '\u{1F1F2}\u{1F1F0}', digits: 8 },
        { name: 'Madag\u00e1scar', code: '+261', flag: '\u{1F1F2}\u{1F1EC}', digits: 9 },
        { name: 'Mal\u00e1sia', code: '+60', flag: '\u{1F1F2}\u{1F1FE}', digits: [9, 10] },
        { name: 'Malawi', code: '+265', flag: '\u{1F1F2}\u{1F1FC}', digits: 9 },
        { name: 'Maldivas', code: '+960', flag: '\u{1F1F2}\u{1F1FB}', digits: 7 },
        { name: 'Mali', code: '+223', flag: '\u{1F1F2}\u{1F1F1}', digits: 8 },
        { name: 'Malta', code: '+356', flag: '\u{1F1F2}\u{1F1F9}', digits: 8 },
        { name: 'Marrocos', code: '+212', flag: '\u{1F1F2}\u{1F1E6}', digits: 9 },
        { name: 'Maur\u00edcia', code: '+230', flag: '\u{1F1F2}\u{1F1FA}', digits: 8 },
        { name: 'Maurit\u00e2nia', code: '+222', flag: '\u{1F1F2}\u{1F1F7}', digits: 8 },
        { name: 'M\u00e9xico', code: '+52', flag: '\u{1F1F2}\u{1F1FD}', digits: 10 },
        { name: 'Mold\u00e1via', code: '+373', flag: '\u{1F1F2}\u{1F1E9}', digits: 8 },
        { name: 'M\u00f3naco', code: '+377', flag: '\u{1F1F2}\u{1F1E8}', digits: 8 },
        { name: 'Mong\u00f3lia', code: '+976', flag: '\u{1F1F2}\u{1F1F3}', digits: 8 },
        { name: 'Montenegro', code: '+382', flag: '\u{1F1F2}\u{1F1EA}', digits: 8 },
        { name: 'Mo\u00e7ambique', code: '+258', flag: '\u{1F1F2}\u{1F1FF}', digits: 9 },
        { name: 'Myanmar', code: '+95', flag: '\u{1F1F2}\u{1F1F2}', digits: [8, 10] },
        // N
        { name: 'Nam\u00edbia', code: '+264', flag: '\u{1F1F3}\u{1F1E6}', digits: 9 },
        { name: 'Nepal', code: '+977', flag: '\u{1F1F3}\u{1F1F5}', digits: 10 },
        { name: 'Nicar\u00e1gua', code: '+505', flag: '\u{1F1F3}\u{1F1EE}', digits: 8 },
        { name: 'N\u00edger', code: '+227', flag: '\u{1F1F3}\u{1F1EA}', digits: 8 },
        { name: 'Nig\u00e9ria', code: '+234', flag: '\u{1F1F3}\u{1F1EC}', digits: 10 },
        { name: 'Noruega', code: '+47', flag: '\u{1F1F3}\u{1F1F4}', digits: 8 },
        { name: 'Nova Zel\u00e2ndia', code: '+64', flag: '\u{1F1F3}\u{1F1FF}', digits: [9, 10] },
        // O
        { name: 'Om\u00e3', code: '+968', flag: '\u{1F1F4}\u{1F1F2}', digits: 8 },
        // P
        { name: 'Pa\u00edses Baixos', code: '+31', flag: '\u{1F1F3}\u{1F1F1}', digits: 9 },
        { name: 'Panam\u00e1', code: '+507', flag: '\u{1F1F5}\u{1F1E6}', digits: 8 },
        { name: 'Papua Nova Guin\u00e9', code: '+675', flag: '\u{1F1F5}\u{1F1EC}', digits: 8 },
        { name: 'Paquist\u00e3o', code: '+92', flag: '\u{1F1F5}\u{1F1F0}', digits: 10 },
        { name: 'Paraguai', code: '+595', flag: '\u{1F1F5}\u{1F1FE}', digits: 9 },
        { name: 'Peru', code: '+51', flag: '\u{1F1F5}\u{1F1EA}', digits: 9 },
        { name: 'Pol\u00f3nia', code: '+48', flag: '\u{1F1F5}\u{1F1F1}', digits: 9 },
        // R
        { name: 'Reino Unido', code: '+44', flag: '\u{1F1EC}\u{1F1E7}', digits: 10 },
        { name: 'Rep\u00fablica Checa', code: '+420', flag: '\u{1F1E8}\u{1F1FF}', digits: 9 },
        { name: 'Rep\u00fablica Dominicana', code: '+1809', flag: '\u{1F1E9}\u{1F1F4}', digits: 7 },
        { name: 'Rom\u00e9nia', code: '+40', flag: '\u{1F1F7}\u{1F1F4}', digits: 9 },
        { name: 'Ruanda', code: '+250', flag: '\u{1F1F7}\u{1F1FC}', digits: 9 },
        { name: 'R\u00fassia', code: '+7', flag: '\u{1F1F7}\u{1F1FA}', digits: 10 },
        // S
        { name: 'Samoa', code: '+685', flag: '\u{1F1FC}\u{1F1F8}', digits: 7 },
        { name: 'S\u00e3o Tom\u00e9 e Pr\u00edncipe', code: '+239', flag: '\u{1F1F8}\u{1F1F9}', digits: 7 },
        { name: 'Senegal', code: '+221', flag: '\u{1F1F8}\u{1F1F3}', digits: 9 },
        { name: 'Serra Leoa', code: '+232', flag: '\u{1F1F8}\u{1F1F1}', digits: 8 },
        { name: 'S\u00e9rvia', code: '+381', flag: '\u{1F1F7}\u{1F1F8}', digits: [9, 10] },
        { name: 'Singapura', code: '+65', flag: '\u{1F1F8}\u{1F1EC}', digits: 8 },
        { name: 'S\u00edria', code: '+963', flag: '\u{1F1F8}\u{1F1FE}', digits: 9 },
        { name: 'Som\u00e1lia', code: '+252', flag: '\u{1F1F8}\u{1F1F4}', digits: [8, 9] },
        { name: 'Sri Lanka', code: '+94', flag: '\u{1F1F1}\u{1F1F0}', digits: 9 },
        { name: 'Sud\u00e3o', code: '+249', flag: '\u{1F1F8}\u{1F1E9}', digits: 9 },
        { name: 'Su\u00e9cia', code: '+46', flag: '\u{1F1F8}\u{1F1EA}', digits: [9, 10] },
        { name: 'Su\u00ed\u00e7a', code: '+41', flag: '\u{1F1E8}\u{1F1ED}', digits: 9 },
        { name: 'Suriname', code: '+597', flag: '\u{1F1F8}\u{1F1F7}', digits: 7 },
        // T
        { name: 'Tail\u00e2ndia', code: '+66', flag: '\u{1F1F9}\u{1F1ED}', digits: 9 },
        { name: 'Taiwan', code: '+886', flag: '\u{1F1F9}\u{1F1FC}', digits: 9 },
        { name: 'Tanz\u00e2nia', code: '+255', flag: '\u{1F1F9}\u{1F1FF}', digits: 9 },
        { name: 'Timor-Leste', code: '+670', flag: '\u{1F1F9}\u{1F1F1}', digits: 8 },
        { name: 'Togo', code: '+228', flag: '\u{1F1F9}\u{1F1EC}', digits: 8 },
        { name: 'Tonga', code: '+676', flag: '\u{1F1F9}\u{1F1F4}', digits: 5 },
        { name: 'Trinidad e Tobago', code: '+1868', flag: '\u{1F1F9}\u{1F1F9}', digits: 7 },
        { name: 'Tun\u00edsia', code: '+216', flag: '\u{1F1F9}\u{1F1F3}', digits: 8 },
        { name: 'Turquemenist\u00e3o', code: '+993', flag: '\u{1F1F9}\u{1F1F2}', digits: 8 },
        { name: 'Turquia', code: '+90', flag: '\u{1F1F9}\u{1F1F7}', digits: 10 },
        // U
        { name: 'Ucr\u00e2nia', code: '+380', flag: '\u{1F1FA}\u{1F1E6}', digits: 9 },
        { name: 'Uganda', code: '+256', flag: '\u{1F1FA}\u{1F1EC}', digits: 9 },
        { name: 'Uruguai', code: '+598', flag: '\u{1F1FA}\u{1F1FE}', digits: 8 },
        { name: 'Uzbequist\u00e3o', code: '+998', flag: '\u{1F1FA}\u{1F1FF}', digits: 9 },
        // V
        { name: 'Venezuela', code: '+58', flag: '\u{1F1FB}\u{1F1EA}', digits: 10 },
        { name: 'Vietname', code: '+84', flag: '\u{1F1FB}\u{1F1F3}', digits: 9 },
        // Z
        { name: 'Z\u00e2mbia', code: '+260', flag: '\u{1F1FF}\u{1F1F2}', digits: 9 },
        { name: 'Zimbabu\u00e9', code: '+263', flag: '\u{1F1FF}\u{1F1FC}', digits: 9 },
    ];

    let selectedCountry = countries[0]; // Portugal default

    // ─── Intro Video ─────────────────────────────
    const introOverlay = document.getElementById('intro-overlay');
    const introVideo   = document.getElementById('intro-video');
    const bgVideo      = document.getElementById('bg-video');
    document.body.classList.add('loading');

    // Revela o conteúdo principal (remove overlay do intro)
    function showMainContent() {
        if (introOverlay.classList.contains('fading')) return;
        introOverlay.classList.add('fading');

        // Remove 'loading' agora → zoomIn da página corre em paralelo com o fade do overlay
        document.body.classList.remove('loading');

        introOverlay.style.opacity = '0';
        introOverlay.style.transition = 'opacity 0.8s ease';

        setTimeout(() => {
            introOverlay.style.display = 'none';
            if (bgVideo) {
                const playPromise = bgVideo.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => { bgVideo.style.display = 'none'; });
                }
            }
        }, 800);
    }

    if (introVideo) {
        // Fallback de segurança: se o vídeo nunca carregar/jogar, mostra em 3s
        const quickFallback = setTimeout(() => showMainContent(), 3000);

        introVideo.addEventListener('canplay', () => {
            clearTimeout(quickFallback);
            introVideo.play().catch(() => showMainContent());
        }, { once: true });

        // ── PRINCIPAL: inicia a transição 1.5 s antes do fim do vídeo ──
        // O form começa a aparecer enquanto o vídeo ainda está a correr.
        introVideo.addEventListener('timeupdate', () => {
            if (introVideo.duration && introVideo.currentTime >= introVideo.duration - 0.5) {
                showMainContent();
            }
        });

        introVideo.addEventListener('ended', () => showMainContent());
        introVideo.addEventListener('error', () => {
            clearTimeout(quickFallback);
            showMainContent();
        });

        introVideo.load();
        introVideo.play().catch(() => {});

    } else {
        setTimeout(() => showMainContent(), 500);
    }

    // ─── Background Video — Loop nativo ──────────
    if (bgVideo) {
        bgVideo.loop = true;
    }

    // ─── Custom Cursor (desktop apenas) ──────────
    const cursor         = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');

    if (window.matchMedia('(pointer: fine)').matches && cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top  = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        const hoverTargets = document.querySelectorAll('a, button, input, select, .social-icon, .country-selector, .country-option');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                cursorFollower.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                cursorFollower.classList.remove('hovering');
            });
        });
    }

    // ─── Country Selector ────────────────────────
    const countrySelector = document.getElementById('country-selector');
    const countryDropdown = document.getElementById('country-dropdown');
    const countryList     = document.getElementById('country-list');
    const countrySearch   = document.getElementById('country-search');
    const selectedFlag    = document.getElementById('selected-flag');
    const selectedCode    = document.getElementById('selected-code');
    const phoneInput      = document.getElementById('signup-phone');

    function renderCountryList(filter = '') {
        const filtered = countries.filter(c =>
            c.name.toLowerCase().includes(filter.toLowerCase()) ||
            c.code.includes(filter)
        );
        countryList.innerHTML = filtered.map(c => {
            const isSelected = c.name === selectedCountry.name && c.code === selectedCountry.code;
            return `<div class="country-option${isSelected ? ' selected' : ''}"
                        data-name="${c.name}"
                        data-code="${c.code}"
                        data-flag="${c.flag}"
                        data-digits="${Array.isArray(c.digits) ? c.digits.join(',') : c.digits}">
                <span class="country-option-flag">${c.flag}</span>
                <span class="country-option-name">${c.name}</span>
                <span class="country-option-code">${c.code}</span>
            </div>`;
        }).join('');

        countryList.querySelectorAll('.country-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const digitsRaw = opt.dataset.digits;
                selectedCountry = {
                    name:   opt.dataset.name,
                    code:   opt.dataset.code,
                    flag:   opt.dataset.flag,
                    digits: digitsRaw.includes(',') ? digitsRaw.split(',').map(Number) : parseInt(digitsRaw)
                };
                selectedFlag.textContent = selectedCountry.flag;
                selectedCode.textContent = selectedCountry.code;
                closeDropdown();
                phoneInput.focus();
                clearPhoneError();
            });

            if (window.matchMedia('(pointer: fine)').matches && cursor && cursorFollower) {
                opt.addEventListener('mouseenter', () => {
                    cursor.classList.add('hovering');
                    cursorFollower.classList.add('hovering');
                });
                opt.addEventListener('mouseleave', () => {
                    cursor.classList.remove('hovering');
                    cursorFollower.classList.remove('hovering');
                });
            }
        });
    }

    function openDropdown() {
        countryDropdown.classList.remove('hidden');
        countrySelector.classList.add('open');
        countrySearch.value = '';
        renderCountryList();
        setTimeout(() => countrySearch.focus(), 50);
    }

    function closeDropdown() {
        countryDropdown.classList.add('hidden');
        countrySelector.classList.remove('open');
    }

    countrySelector.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        countryDropdown.classList.contains('hidden') ? openDropdown() : closeDropdown();
    });

    countrySearch.addEventListener('input', () => {
        renderCountryList(countrySearch.value);
    });

    document.addEventListener('click', (e) => {
        if (!countryDropdown.classList.contains('hidden') &&
            !countryDropdown.contains(e.target) &&
            !countrySelector.contains(e.target)) {
            closeDropdown();
        }
    });

    phoneInput.addEventListener('input', () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, '');
        clearPhoneError();
    });

    // ─── Validation ──────────────────────────────
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const digits   = phone.replace(/\D/g, '');
        const expected = selectedCountry.digits;
        return Array.isArray(expected) ? expected.includes(digits.length) : digits.length === expected;
    }

    function getExpectedDigits() {
        const d = selectedCountry.digits;
        return Array.isArray(d) ? d.join(' ou ') : d;
    }

    function showError(fieldEl, errorEl, message) {
        fieldEl.classList.add('has-error');
        errorEl.textContent = message;
        errorEl.classList.add('visible');
    }

    function clearError(fieldEl, errorEl) {
        fieldEl.classList.remove('has-error');
        errorEl.classList.remove('visible');
        errorEl.textContent = '';
    }

    function clearPhoneError() {
        const phoneField = phoneInput.closest('.form-field');
        const phoneError = document.getElementById('phone-error');
        clearError(phoneField, phoneError);
    }

    // ─── Sign Up Form ────────────────────────────
    const signupForm    = document.getElementById('signup-form');
    const signupSuccess = document.getElementById('signup-success');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput  = document.getElementById('signup-name');
            const emailInput = document.getElementById('signup-email');
            const emailError = document.getElementById('email-error');
            const phoneError = document.getElementById('phone-error');
            const emailField = emailInput.closest('.form-field');
            const phoneField = phoneInput.closest('.form-field');
            const nameField  = nameInput.closest('.form-field');

            let valid = true;

            // Name
            if (!nameInput.value.trim()) {
                nameField.classList.add('has-error');
                valid = false;
                nameInput.addEventListener('input', function handler() {
                    if (nameInput.value.trim()) {
                        nameField.classList.remove('has-error');
                        nameInput.removeEventListener('input', handler);
                    }
                });
            } else {
                nameField.classList.remove('has-error');
            }

            // Email
            if (!emailInput.value.trim()) {
                showError(emailField, emailError, 'O email é obrigatório');
                valid = false;
            } else if (!validateEmail(emailInput.value.trim())) {
                showError(emailField, emailError, 'Verifica o formato do email');
                valid = false;
            } else {
                clearError(emailField, emailError);
            }

            emailInput.addEventListener('input', function handler() {
                if (validateEmail(emailInput.value.trim())) {
                    clearError(emailField, emailError);
                    emailInput.removeEventListener('input', handler);
                }
            });

            // Phone
            if (!phoneInput.value.trim()) {
                showError(phoneField, phoneError, 'O número é obrigatório');
                valid = false;
            } else if (!validatePhone(phoneInput.value)) {
                showError(phoneField, phoneError, `Número inválido para ${selectedCountry.name} (${getExpectedDigits()} dígitos)`);
                valid = false;
            } else {
                clearError(phoneField, phoneError);
            }

            if (!valid) return;

            // ── Success ──
            signupForm.style.opacity    = '0';
            signupForm.style.transform  = 'translateY(-10px)';
            signupForm.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

            setTimeout(() => {
                signupForm.style.display = 'none';
                signupSuccess.classList.remove('hidden');
                signupSuccess.style.opacity = '0';
                requestAnimationFrame(() => {
                    signupSuccess.style.transition = 'opacity 0.6s ease';
                    signupSuccess.style.opacity    = '1';
                });
            }, 400);
        });
    }

    // ─── Magnetic Effect (desktop) ───────────────
    if (window.matchMedia('(pointer: fine)').matches) {
        const magneticEls = document.querySelectorAll('.social-icon, .signup-btn');
        magneticEls.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width  / 2;
                const y = e.clientY - rect.top  - rect.height / 2;
                el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform  = '';
                el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                setTimeout(() => { el.style.transition = ''; }, 400);
            });
        });
    }

});