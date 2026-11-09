/* ============================================================
   SEM VERGONHA — VIRTUAL TOUR · CENAS
   Este e o ficheiro que editas. Nao precisas de mexer em mais nada.

   COMO ADICIONAR UMA CENA
   1. Poe a imagem 360 (equirectangular, 2:1, ex. 6000x3000) em
      virtualtour-semvergonha2026/360/  — JPG, idealmente < 3 MB.
   2. Copia um bloco abaixo e muda id, image, textos.
   3. Liga as cenas com "hotspots" (os circulos clicaveis).

   COMO DESCOBRIR O yaw / pitch DE UM HOTSPOT
   Abre a pagina com  ?edit  no fim do link, ex.:
     https://www.semvergonharestaurant.com/virtualtour-semvergonha2026/?edit
   Clica no sitio exacto da imagem onde queres o circulo: aparece
   no ecra (e na consola) o  yaw  e  pitch  para copiares.

   CAMPOS
   id          nome unico, sem espacos (usa-se no link #id)
   image       caminho da imagem 360
   yaw/pitch   para onde a camara olha quando a cena abre (graus)
   hfov        abertura inicial da camara (50 a 120; menor = mais zoom)
   title       { pt, en }
   text        { pt, en }  descricao que aparece no cartao
   tags        [{ pt, en }, ...]  pequenos detalhes (opcional)
   hotspots    circulos para passar a outra cena:
                 { to: 'id-da-cena', yaw, pitch, arrive: yaw de chegada (opcional) }
   info        pontos de detalhe com texto (opcional):
                 { yaw, pitch, title: {pt,en}, text: {pt,en} }
   ============================================================ */

window.SV_TOUR = {

  /* Pasta das imagens (nao mexer) */
  base: '/virtualtour-semvergonha2026/360/',

  scenes: [

    {
      id: 'entrada',
      image: '01-entrada.jpg',
      yaw: 0, pitch: 0, hfov: 100,
      title: { pt: 'Entrada', en: 'Entrance' },
      text: {
        pt: 'É por aqui que tudo começa. Uma porta aberta para o mar e uma mesa à tua espera.',
        en: 'This is where it all begins. A door open to the sea and a table waiting for you.'
      },
      tags: [
        { pt: 'Frente ao mar', en: 'Seafront' },
        { pt: 'Av. da República', en: 'Av. da República' }
      ],
      hotspots: [
        { to: 'sala', yaw: 0, pitch: -8 }
      ]
    },

    {
      id: 'sala',
      image: '02-sala.jpg',
      yaw: 0, pitch: 0, hfov: 100,
      title: { pt: 'A Sala', en: 'The Dining Room' },
      text: {
        pt: 'Mesas para partilhar, luz suave e uma cozinha que não se esconde. Almoços que se alongam, jantares que não têm pressa.',
        en: 'Tables made for sharing, soft light and a kitchen that does not hide. Lunches that linger, dinners in no rush.'
      },
      tags: [
        { pt: 'Cozinha de partilha', en: 'Sharing kitchen' },
        { pt: 'Pratos de autor', en: 'Signature dishes' }
      ],
      hotspots: [
        { to: 'entrada', yaw: 180, pitch: -8 },
        { to: 'bar', yaw: 90, pitch: -8 }
      ]
    },

    {
      id: 'bar',
      image: '03-bar.jpg',
      yaw: 0, pitch: 0, hfov: 100,
      title: { pt: 'O Bar', en: 'The Bar' },
      text: {
        pt: 'Cocktails de autor feitos ao balcão, do primeiro gin ao último brinde.',
        en: 'Signature cocktails made at the counter, from the first gin to the last toast.'
      },
      tags: [
        { pt: 'Cocktails de autor', en: 'Signature cocktails' }
      ],
      hotspots: [
        { to: 'sala', yaw: -90, pitch: -8 },
        { to: 'esplanada', yaw: 90, pitch: -8 }
      ]
    },

    {
      id: 'esplanada',
      image: '04-esplanada.jpg',
      yaw: 0, pitch: 0, hfov: 100,
      title: { pt: 'Esplanada', en: 'Terrace' },
      text: {
        pt: 'O mar à frente e o resto do dia por decidir. O melhor lugar para ficar mais um bocadinho.',
        en: 'The sea ahead and the rest of the day still undecided. The best place to stay a little longer.'
      },
      tags: [
        { pt: 'Vista mar', en: 'Sea view' }
      ],
      hotspots: [
        { to: 'bar', yaw: -90, pitch: -8 }
      ]
    }

  ]
};
