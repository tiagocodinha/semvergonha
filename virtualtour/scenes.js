
function go(to, yaw, pitch) { return { to: to, yaw: yaw, pitch: pitch, arrive: yaw }; }

window.SV_TOUR = {

  base: '/virtualtour/360/',

  scenes: [

    {
      id: 'entrada',
      image: '1.jpg',
      yaw: 0, pitch: 0,
      title: { pt: 'Entrada', en: 'Entrance' },
      hotspots: [ go('lounge', -178.2, -26.4) ]
    },

    {
      id: 'lounge',
      image: '2.jpg',
      yaw: -40, pitch: 0,
      title: { pt: 'Lounge', en: 'Lounge' },
      info: [
        { yaw: 55, pitch: 4,
          title: { pt: 'A parede', en: 'The wall' },
          text: { pt: 'Azulejo azul com círculos dourados: o ponto de partida da decoração.', en: 'Blue tiles with golden circles: where the décor begins.' } }
      ],
      hotspots: [ go('entrada', -4.0, -21.9), go('bar', 173.8, -30.8) ]
    },

    {
      id: 'bar',
      image: '3.jpg',
      yaw: -70, pitch: 0,
      title: { pt: 'O Bar', en: 'The Bar' },
      hotspots: [ go('lounge', 2.4, -28.3), go('bar-sala', 179.3, -25.4) ]
    },

    {
      id: 'bar-sala',
      image: '4.jpg',
      yaw: -30, pitch: 0,
      title: { pt: 'Do bar à sala', en: 'From bar to dining room' },
      hotspots: [ go('bar', -2.7, -20.4), go('sala', -140.6, -16.1) ]
    },

    {
      id: 'sala',
      image: '5.jpg',
      yaw: 0, pitch: 0,
      title: { pt: 'A Sala', en: 'The Dining Room' },
      hotspots: [ go('bar-sala', 115, -10), go('sala-arte', -80, -12) ]
    },

    {
      id: 'sala-arte',
      image: '6.jpg',
      yaw: 0, pitch: 10,
      title: { pt: 'O teto que fala', en: 'The ceiling that talks' },
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
      hotspots: [ go('sala-arte', -100, -10), go('sala-fundos', 110, -10) ]
    },

    {
      id: 'sala-fundos',
      image: '8.jpg',
      yaw: 10, pitch: 0,
      title: { pt: 'Sala dos fundos', en: 'The back room' },
      hotspots: [ go('sala-fundo', -130, -10), go('sala-fundos-2', 10, -10) ]
    },

    {
      id: 'sala-fundos-2',
      image: '9.jpg',
      yaw: 40, pitch: 0,
      title: { pt: 'Ao fundo', en: 'At the far end' },
      hotspots: [ go('sala-fundos', 120, -10) ]
    }

  ]
};
