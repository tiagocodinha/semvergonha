
function go(to, yaw, pitch) { return { to: to, yaw: yaw, pitch: pitch, arrive: yaw }; }

window.SV_TOUR = {

  base: '/virtualtour/360/',

  scenes: [

    {
      id: 'entrada',
      image: '1.jpg',
      yaw: -158.0, pitch: 0.1,
      title: { pt: 'A Entrada', en: 'Entrance' },
      /* Animacao de abertura (so na primeira entrada na visita): a camara
         roda de "from" ate "to" (yaw/pitch da cena) e aparece uma mensagem. */
      intro: {
        from: { yaw: 0.0, pitch: 0.0 },
        to:   { yaw: -158.0, pitch: 0.1 },
        duration: 4500,            // ms que demora a rodar
        message: { pt: 'Welcome to Sem Vergonha', en: 'Welcome to Sem Vergonha' },
        messageTime: 3000          // ms que a mensagem fica visivel
      },
      hotspots: [ go('lounge', -178.2, -26.4) ]
    },

    {
      id: 'lounge',
      image: '2.jpg',
      yaw: -40, pitch: 0,
      title: { pt: 'O Lounge', en: 'Lounge' },
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
      title: { pt: 'O Bar', en: 'From bar to dining room' },
      hotspots: [ go('bar', -2.7, -20.4), go('sala', -140.6, -16.1) ]
    },

    {
      id: 'sala',
      image: '5.jpg',
      yaw: 0, pitch: 0,
      title: { pt: 'A Sala', en: 'The Dining Room' },
      hotspots: [ go('bar-sala', 128.7, -13.0), go('sala-arte', -176.1, -19.9) ]
    },

    {
      id: 'sala-arte',
      image: '6.jpg',
      yaw: 0, pitch: 10,
      title: { pt: 'A Sala', en: 'The ceiling that talks' },
      hotspots: [ go('sala', 1.4, -19.4), go('bar-sala', 94.6, -19.1), go('sala-fundo', -112.2, -21.5) ]
    },

    {
      id: 'sala-fundo',
      image: '7.jpg',
      yaw: 30, pitch: 0,
      title: { pt: 'A Sala', en: 'Towards the back' },
      hotspots: [ go('sala-arte', -31.3, -20.9), go('sala-fundos', 102.4, -31.1) ]
    },

    {
      id: 'sala-fundos',
      image: '8.jpg',
      yaw: 10, pitch: 0,
      title: { pt: 'A Sala Privada', en: 'The back room' },
      hotspots: [ go('sala-fundo', -108.7, -31.8), go('sala-fundos-2', -34.2, -17.8) ]
    },

    {
      id: 'sala-fundos-2',
      image: '9.jpg',
      yaw: 40, pitch: 0,
      title: { pt: 'A Sala Privada', en: 'At the far end' },
      hotspots: [ go('sala-fundos', -143.5, -19.0) ]
    }

  ]
};
