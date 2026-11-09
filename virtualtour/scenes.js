/* ============================================================
   SEM VERGONHA — VIRTUAL TOUR · CENAS
   Este e o ficheiro que editas. Nao precisas de mexer em mais nada.

   COMO ADICIONAR UMA CENA
   1. Poe a imagem 360 (equirectangular, 2:1) em
      virtualtour/360/  — JPG, idealmente ~1 MB.
   2. Copia um bloco abaixo e muda id, image, textos.
   3. Liga as cenas com "go(...)" (os circulos clicaveis).

   COMO DESCOBRIR O yaw / pitch DE UM HOTSPOT
   Abre a pagina com  ?edit  no fim do link, ex.:
     https://www.semvergonharestaurant.com/virtualtour/?edit
   Clica no sitio exacto do chao onde queres o circulo: aparece
   no ecra (e fica copiado) o  yaw  e  pitch.

   CAMPOS
   id          nome unico, sem espacos (usa-se no link #id)
   image       ficheiro da imagem 360
   thumb       (opcional) miniatura leve para a gaveta dos espacos
   yaw/pitch   para onde a camara olha quando a cena abre (graus)
   hfov        (opcional) abertura da camara; por defeito o maximo (120). Menor = mais zoom
   title/text  { pt, en }
   tags        [{ pt, en }, ...]  pequenos detalhes (opcional)
   hotspots    go('id-da-cena', yaw, pitch)  — a camara chega a olhar
               na mesma direcao em que "caminhou"
   info        pontos de detalhe com texto (opcional):
                 { yaw, pitch, title: {pt,en}, text: {pt,en} }
   ============================================================ */

/* atalho: circulo que leva a outra cena */
function go(to, yaw, pitch) { return { to: to, yaw: yaw, pitch: pitch, arrive: yaw }; }

window.SV_TOUR = {

  base: '/virtualtour/360/',

  scenes: [

    {
      id: 'entrada',
      image: '1.jpg',
      yaw: 0, pitch: 0,
      title: { pt: 'Entrada', en: 'Entrance' },
      text: {
        pt: 'É por aqui que tudo começa. Uma porta de vidro aberta para o mar e, logo ao lado, o bar a chamar por ti.',
        en: 'This is where it all begins. A glass door open to the sea and, right beside it, the bar calling your name.'
      },
      tags: [{ pt: 'Frente ao mar', en: 'Seafront' }, { pt: 'Lounge', en: 'Lounge' }],
      hotspots: [ go('lounge', -135, -14) ]
    },

    {
      id: 'lounge',
      image: '2.jpg',
      yaw: -40, pitch: 0,
      title: { pt: 'Lounge', en: 'Lounge' },
      text: {
        pt: 'Sofás baixos, azulejo azul e círculos dourados na parede. Um canto para esperar, para brindar ou para ficar.',
        en: 'Low sofas, blue tiles and golden circles on the wall. A corner to wait, to toast or simply to stay.'
      },
      tags: [{ pt: 'Para brindar', en: 'For a toast' }],
      info: [
        { yaw: 55, pitch: 4,
          title: { pt: 'A parede', en: 'The wall' },
          text: { pt: 'Azulejo azul com círculos dourados: o ponto de partida da decoração.', en: 'Blue tiles with golden circles: where the décor begins.' } }
      ],
      hotspots: [ go('entrada', 10, -14), go('bar', -95, -14) ]
    },

    {
      id: 'bar',
      image: '3.jpg',
      yaw: -70, pitch: 0,
      title: { pt: 'O Bar', en: 'The Bar' },
      text: {
        pt: 'Cocktails de autor feitos ao balcão, sob uma cúpula de madeira e luz quente. Do primeiro gin ao último brinde.',
        en: 'Signature cocktails made at the counter, under a wooden canopy and warm light. From the first gin to the last toast.'
      },
      tags: [{ pt: 'Cocktails de autor', en: 'Signature cocktails' }],
      hotspots: [ go('lounge', 15, -14), go('bar-sala', 95, -14) ]
    },

    {
      id: 'bar-sala',
      image: '4.jpg',
      yaw: -30, pitch: 0,
      title: { pt: 'Do bar à sala', en: 'From bar to dining room' },
      text: {
        pt: 'Daqui vês os dois mundos: o balcão de um lado e as mesas do outro, com o mar ao fundo.',
        en: 'From here you see both worlds: the counter on one side, the tables on the other, with the sea beyond.'
      },
      hotspots: [ go('bar', -78, -14), go('sala', -150, -12) ]
    },

    {
      id: 'sala',
      image: '5.jpg',
      yaw: 0, pitch: 0,
      title: { pt: 'A Sala', en: 'The Dining Room' },
      text: {
        pt: 'Mesas para partilhar, janelões de luz e um teto cheio de arte. Almoços que se alongam, jantares que não têm pressa.',
        en: 'Tables made for sharing, big windows full of light and a ceiling covered in art. Lunches that linger, dinners in no rush.'
      },
      tags: [{ pt: 'Cozinha de partilha', en: 'Sharing kitchen' }, { pt: 'Pratos de autor', en: 'Signature dishes' }],
      hotspots: [ go('bar-sala', 115, -10), go('sala-arte', -80, -12) ]
    },

    {
      id: 'sala-arte',
      image: '6.jpg',
      yaw: 0, pitch: 10,
      title: { pt: 'O teto que fala', en: 'The ceiling that talks' },
      text: {
        pt: 'Olha para cima. Cartazes, rostos e cores a cobrir o teto: cada mesa tem uma história diferente por cima.',
        en: 'Look up. Posters, faces and colour all over the ceiling: every table has a different story above it.'
      },
      tags: [{ pt: 'Arte', en: 'Art' }],
      info: [
        { yaw: 20, pitch: 55,
          title: { pt: 'Olha para cima', en: 'Look up' },
          text: { pt: 'Um teto feito de cartazes, retratos e cor.', en: 'A ceiling made of posters, portraits and colour.' } }
      ],
      hotspots: [ go('sala', 90, -10), go('sala-fundo', 140, -10) ]
    },

    {
      id: 'sala-fundo',
      image: '7.jpg',
      yaw: 30, pitch: 0,
      title: { pt: 'A caminho do fundo', en: 'Towards the back' },
      text: {
        pt: 'A sala continua, mais verde e mais recolhida. Banco corrido, plantas e uma girafa que vigia tudo.',
        en: 'The room carries on, greener and more tucked away. Banquettes, plants and a giraffe keeping watch.'
      },
      hotspots: [ go('sala-arte', -100, -10), go('sala-fundos', 110, -10) ]
    },

    {
      id: 'sala-fundos',
      image: '8.jpg',
      yaw: 10, pitch: 0,
      title: { pt: 'Sala dos fundos', en: 'The back room' },
      text: {
        pt: 'Chão preto e branco, teto em mosaico e uma mesa só para o teu grupo. Mais reservado, com o mesmo à vontade.',
        en: 'Black and white floor, mosaic ceiling and a table just for your group. More private, same easy mood.'
      },
      tags: [{ pt: 'Grupos', en: 'Groups' }, { pt: 'Reservado', en: 'Private' }],
      hotspots: [ go('sala-fundo', -130, -10), go('sala-fundos-2', 10, -10) ]
    },

    {
      id: 'sala-fundos-2',
      image: '9.jpg',
      yaw: 40, pitch: 0,
      title: { pt: 'Ao fundo', en: 'At the far end' },
      text: {
        pt: 'A última sala. Uma parede iluminada, ripas em verde-escuro e o sítio perfeito para uma noite que não queres que acabe.',
        en: 'The last room. A softly lit wall, dark green slats and the perfect spot for a night you do not want to end.'
      },
      hotspots: [ go('sala-fundos', 120, -10) ]
    }

  ]
};
