const labelColors = [
  "rgb(0, 156, 109)",
  "rgb(82, 177, 83)",
  "rgb(120, 189, 118)",
  "rgb(244, 231, 15)",
  "rgb(240, 181, 15)",
  "rgb(235, 130, 53)",
  "rgb(215, 34, 31)",
];
const GLSlabelColors = [
  "rgb(164, 219, 248)",
  "rgb(140, 180, 211)",
  "rgb(119, 146, 177)",
  "rgb(96, 111, 143)",
  "rgb(77, 82, 113)",
  "rgb(77, 82, 113)",
  "rgb(40, 27, 53)",
];
const lettres = ["A", "B", "C", "D", "E", "F", "G"];
const DPEcvsWidth = 700;
const DPEcvsHeight = 700;
const GLScvsWidth = 700;
const GLScvsHeight = 700;
const DPEgraphWidth = (DPEcvsWidth - 20) / 1.56;
const GLSgraphWidth = (GLScvsWidth - 20) / 1.56;
const padX = 10 + DPEgraphWidth * 0.56;
const padY = (DPEcvsHeight - DPEgraphWidth) / 2;
const GLSpadX = GLScvsWidth * 0.03;
const GLSpadY = 10 + (GLScvsHeight - GLSgraphWidth) / 2;
const DPE_label_pos = [0, 0, DPEgraphWidth, DPEgraphWidth];
const GLS_label_pos = [0, 0, GLSgraphWidth, GLSgraphWidth];
//[82, 109, 137, 166, 195, 224, 252];

let DPE_rating;
let GLS_rating;

// console.log("padX = " + padX);
// console.log("padY = " + padY);
// console.log("DPEgraphWidth = " + DPEgraphWidth);
// console.log("GLSpadX = " + GLSpadX);
// console.log("GLSpadY = " + GLSpadY);
// console.log("GLSgraphWidth = " + GLSgraphWidth);

// ----------------------------------------------
//   etiquette via un CANVAS
// ----------------------------------------------

// fonction pour déterminer la classe DPE (DPE_rating)
// return une lettre ou un chiffre
// -----> à revoir avec la prise en compte du GLS
function set_class_DPE(DPE_rating, GLS_rating) {
  let class_DPE = ["A", 0];
  let DPERanking;
  let GLSRanking = set_class_GLS(GLS_rating);
  if (DPE_rating <= 70) {
    class_DPE = ["A", 0];
  } else if (DPE_rating <= 110) {
    class_DPE = ["B", 1];
  } else if (DPE_rating <= 180) {
    class_DPE = ["C", 2];
  } else if (DPE_rating <= 250) {
    class_DPE = ["D", 3];
  } else if (DPE_rating <= 330) {
    class_DPE = ["E", 4];
  } else if (DPE_rating <= 420) {
    class_DPE = ["F", 5];
  } else {
    class_DPE = ["G", 6];
  }
  class_DPE[1] <= GLSRanking[1]
    ? (DPERanking = GLSRanking)
    : (DPERanking = class_DPE);

  return DPERanking;
}

// fonction pour calculer les coordonnées de chaque polygone (DPE_rating)
// return un tableau d'objet avec les coordonnées de chaque polygone
function set_DPE_label_position(DPE_rating, GLS_rating) {
  let labelPos = new Array();
  let labelHeight = (33 / 288) * DPE_label_pos[3];
  for (i = 0; i <= 6; i++) {
    if (
      set_class_DPE(DPE_rating, GLS_rating)[1] == i &&
      DPE_label_pos[3] != 0
    ) {
      labelHeight = (72 / 288) * DPE_label_pos[3];
    } else {
      labelHeight = (33 / 288) * DPE_label_pos[3];
    }
    i == 0
      ? (labelPos[0] = [
          [DPE_label_pos[0], DPE_label_pos[1]], //pt A
          [
            (82 / 288) * DPE_label_pos[2] -
              (labelHeight / 2) * Math.tan((36 * Math.PI) / 180),
            DPE_label_pos[1],
          ], //pt B
          [(82 / 288) * DPE_label_pos[2], labelHeight / 2], //pt C
          [
            (82 / 288) * DPE_label_pos[2] -
              (labelHeight / 2) * Math.tan((36 * Math.PI) / 180),
            labelHeight,
          ], //pt D
          [DPE_label_pos[0], labelHeight], //pt E
        ])
      : (labelPos[i] = [
          [DPE_label_pos[0], DPE_label_pos[1] + labelPos[i - 1][3][1] + 3], //pt A
          [
            labelPos[i - 1][2][0] +
              ((labelPos[i - 1][4][1] - labelPos[i - 1][0][1]) / 2) *
                Math.tan((36 * Math.PI) / 180),
            DPE_label_pos[1] + labelPos[i - 1][3][1] + 3,
          ], //pt B
          [
            labelPos[i - 1][2][0] +
              (labelHeight / 2 +
                (labelPos[i - 1][4][1] - labelPos[i - 1][0][1]) / 2) *
                Math.tan((36 * Math.PI) / 180),
            labelHeight / 2 + labelPos[i - 1][3][1] + 3,
          ], //pt C
          [
            labelPos[i - 1][2][0] +
              ((labelPos[i - 1][4][1] - labelPos[i - 1][0][1]) / 2) *
                Math.tan((36 * Math.PI) / 180),
            labelHeight + labelPos[i - 1][3][1] + 3,
          ], //pt D
          [DPE_label_pos[0], labelHeight + labelPos[i - 1][3][1] + 3], //pt E
        ]);
  }

  return labelPos;
}

// fonction qui dessine un polygone (coordonnées)
function draw_DPE_polygon(label_pos, color) {
  const DPEcvs = document.getElementById("DPEcvs");

  ctx = DPEcvs.getContext("2d");
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(padX + label_pos[0][0], padY + label_pos[0][1]);
  ctx.lineTo(padX + label_pos[1][0], padY + label_pos[1][1]);
  ctx.lineTo(padX + label_pos[2][0], padY + label_pos[2][1]);
  ctx.lineTo(padX + label_pos[3][0], padY + label_pos[3][1]);
  ctx.lineTo(padX + label_pos[4][0], padY + label_pos[4][1]);
  ctx.fill();
}

// fonction qui trace le contour du polygone, le cartouche et les lettrages (label_pos, index, DPE Rating)
function draw_DPE_stroke(label_pos, index, DPErating, GLSrating) {
  let classDPE = set_class_DPE(DPErating, GLSrating)[1];
  let font1 = "bold " + DPEcvsWidth / 200 + "rem verdana";
  let font2 = " " + (0.7 * DPEcvsWidth) / 400 + "rem verdana";
  let fontL = "bold " + DPEcvsWidth / 130 + "rem verdana";
  let fontl = "bold " + DPEcvsWidth / 240 + "rem verdana";
  let fontSub = " " + (0.5 * DPEcvsWidth) / 400 + "rem verdana";
  let fontConso = "bold" + DPEcvsWidth / 500 + "rem verdana";

  const DPEcvs = document.getElementById("DPEcvs");
  if (index == classDPE) {
    if (DPEcvs.getContext) {
      ctx = DPEcvs.getContext("2d");
      ctx.fillStyle = "rga(0,0,0,1)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(padX + label_pos[0][0], padY + label_pos[0][1]); //pt A
      ctx.lineTo(padX + label_pos[1][0], padY + label_pos[1][1]); // pt B
      ctx.lineTo(padX + label_pos[2][0], padY + label_pos[2][1]); // pt C
      ctx.lineTo(padX + label_pos[3][0], padY + label_pos[3][1]); // pt D
      ctx.lineTo(padX + label_pos[4][0], padY + label_pos[4][1]); // pt E
      ctx.closePath();
      // rectangle pour le texte:
      ctx.moveTo(padX + label_pos[0][0], padY + label_pos[0][1]);
      ctx.lineTo(
        padX + label_pos[0][0] - 0.56 * DPEgraphWidth + 8,
        padY + label_pos[0][1]
      );
      ctx.quadraticCurveTo(
        padX + label_pos[0][0] - 0.56 * DPEgraphWidth,
        padY + label_pos[0][1],
        padX + label_pos[0][0] - 0.56 * DPEgraphWidth,
        padY + label_pos[0][1] + 8
      );
      ctx.lineTo(
        padX + label_pos[0][0] - 0.56 * DPEgraphWidth,
        padY + label_pos[4][1] - 8
      );
      ctx.quadraticCurveTo(
        padX + label_pos[0][0] - 0.56 * DPEgraphWidth,
        padY + label_pos[4][1],
        padX + label_pos[0][0] - 0.56 * DPEgraphWidth + 8,
        padY + label_pos[4][1]
      );
      ctx.lineTo(padX + label_pos[0][0], padY + label_pos[4][1]);
      ctx.closePath();
      ctx.stroke();
      // trait de séparation :
      ctx.moveTo(
        padX + label_pos[0][0] - DPEgraphWidth / 3.8,
        padY + label_pos[0][1] + 4
      );
      ctx.lineTo(
        padX + label_pos[4][0] - DPEgraphWidth / 3.8,
        padY + label_pos[4][1] - 4
      );
      ctx.stroke();
      // texte lettrage DPE
      //let font1 = "bold " + DPEcvsWidth / 200 + "rem verdana";
      ctx.fillStyle = "black";
      ctx.font = font1;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        DPE_rating,
        padX + label_pos[0][0] - 0.42 * DPEgraphWidth,
        padY + label_pos[2][1] - 0.025 * DPEgraphWidth,
        0.25 * DPEgraphWidth
      );
      // texte unités DPE
      //let font2 = " " + (0.7 * DPEcvsWidth) / 400 + "rem verdana";
      ctx.fillStyle = "black";
      ctx.font = font2;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        "kWh/m²/an",
        padX + label_pos[0][0] - 0.42 * DPEgraphWidth,
        padY + label_pos[2][1] + 0.06 * DPEgraphWidth,
        0.26 * DPEgraphWidth
      );
      // texte titre consommation
      ctx.fillStyle = "black";
      ctx.font = fontConso;
      ctx.fillText(
        "consommation",
        padX + label_pos[0][0] - 0.41 * DPEgraphWidth,
        padY + label_pos[2][1] - 0.23 * DPEgraphWidth,
        0.25 * DPEgraphWidth
      );
      ctx.fillStyle = "grey";
      ctx.font = fontConso;
      ctx.fillText(
        "(énergie primaire)",
        padX + label_pos[0][0] - 0.41 * DPEgraphWidth,
        padY + label_pos[2][1] - 0.18 * DPEgraphWidth,
        0.31 * DPEgraphWidth
      );
      // texte lettrage GLS
      //let fontSub = " " + (0.5 * DPEcvsWidth) / 400 + "rem verdana";
      ctx.fillStyle = "black";
      ctx.font = font1;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        GLS_rating,
        padX + label_pos[0][0] - 0.13 * DPEgraphWidth,
        padY + label_pos[2][1] - 0.025 * DPEgraphWidth,
        0.23 * DPEgraphWidth
      );
      // texte unités GLS
      ctx.fillStyle = "black";
      ctx.font = font2;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        "kgCO",
        padX + label_pos[0][0] - 0.2 * DPEgraphWidth,
        padY + label_pos[2][1] + 0.06 * DPEgraphWidth,
        0.1 * DPEgraphWidth
      );
      ctx.textBaseline = "top";
      ctx.font = fontSub;
      ctx.fillText(
        "2",
        padX + label_pos[0][0] - 0.145 * DPEgraphWidth,
        padY + label_pos[2][1] + 0.065 * DPEgraphWidth,
        0.014 * DPEgraphWidth
      );
      ctx.textBaseline = "middle";
      ctx.font = font2;
      ctx.fillText(
        "/m²/an",
        padX + label_pos[0][0] - 0.075 * DPEgraphWidth,
        padY + label_pos[2][1] + 0.06 * DPEgraphWidth,
        0.12 * DPEgraphWidth
      );
      // texte titre émission
      ctx.fillStyle = "black";
      ctx.font = fontConso;
      ctx.fillText(
        "émission",
        padX + label_pos[0][0] - 0.13 * DPEgraphWidth,
        padY + label_pos[2][1] - 0.18 * DPEgraphWidth,
        0.19 * DPEgraphWidth
      );
      // incrustation de la lettre
      //let fontL = "bold " + DPEcvsWidth / 130 + "rem verdana";
      ctx.font = fontL;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillStyle = "white";
      ctx.fillText(
        lettres[i],
        padX + label_pos[0][0] + 0.02 * DPEgraphWidth,
        padY + label_pos[2][1] + 0.013 * DPEgraphWidth,
        0.15 * DPEgraphWidth
      );
      ctx.strokeText(
        lettres[i],
        padX + label_pos[0][0] + 0.02 * DPEgraphWidth,
        padY + label_pos[2][1] + 0.013 * DPEgraphWidth,
        0.15 * DPEgraphWidth
      );
    }
  } else {
    // incrustation des autres lettres
    if (DPEcvs.getContext) {
      ctx = DPEcvs.getContext("2d");
      //let fontl = "bold " + DPEcvsWidth / 240 + "rem verdana";
      ctx.font = fontl;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillStyle = "white";
      ctx.fillText(
        lettres[i],
        padX + 0.024 * DPEgraphWidth,
        padY + 0.01 * DPEgraphWidth + label_pos[2][1],
        0.14 * DPEgraphWidth
      );
    }
  }
}

// fonction qui trace toute l'étiquette (DPE_rating, GLS_rating)
function DPE_labelDisplay(DPE_rating, GLS_rating) {
  const DPEcvs = document.getElementById("DPEcvs");
  let positions = new Array();
  let fontl = "normal " + DPEcvsWidth / 600 + "rem verdana";
  let ctx = DPEcvs.getContext("2d");
  positions = set_DPE_label_position(DPE_rating, GLS_rating);

  ctx.clearRect(0, 0, DPEcvs.width, DPEcvs.height);
  ctx.beginPath();
  for (i = 0; i <= 6; i++) {
    draw_DPE_polygon(positions[i], `${labelColors[i]}`);
    draw_DPE_stroke(positions[i], i, DPE_rating, GLS_rating);
  }
  // textes en bas et en haut du graph

  if (DPEcvs.getContext) {
    ctx.font = fontl;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = labelColors[0];
    ctx.fillText(
      "logement extrêmement performant",
      padX,
      padY - 0.05 * DPEgraphWidth,
      0.7 * DPEgraphWidth
    );
    ctx.fillStyle = labelColors[6];
    ctx.fillText(
      "logement extrêmement peu performant",
      padX,
      padY + 1.05 * DPEgraphWidth,
      0.7 * DPEgraphWidth
    );
  }
}

// *******************************etiquette GLS ***************************

// fonction pour déterminer la classe GLS (GLS_rating)
// return une lettre ou un chiffre
function set_class_GLS(GLS_rating) {
  let class_GLS = ["A", 0];
  if (GLS_rating <= 6) {
    class_GLS = ["A", 0];
  } else if (GLS_rating <= 11) {
    class_GLS = ["B", 1];
  } else if (GLS_rating <= 30) {
    class_GLS = ["C", 2];
  } else if (GLS_rating <= 50) {
    class_GLS = ["D", 3];
  } else if (GLS_rating <= 70) {
    class_GLS = ["E", 4];
  } else if (GLS_rating <= 100) {
    class_GLS = ["F", 5];
  } else {
    class_GLS = ["G", 6];
  }
  return class_GLS;
}

// fonction pour calculer les coordonnées de chaque polygone (DPE_rating)
// return un tableau d'objet avec les coordonnées de chaque polygone
function set_GLS_label_position(GLS_rating) {
  let labelPos = new Array();
  let labelHeight = (33 / 288) * DPE_label_pos[3];
  for (i = 0; i <= 6; i++) {
    if (set_class_GLS(GLS_rating)[1] == i && GLS_label_pos[3] != 0) {
      labelHeight = (72 / 288) * GLS_label_pos[3];
    } else {
      labelHeight = (33 / 288) * GLS_label_pos[3];
    }
    i == 0
      ? (labelPos[0] = [
          [GLS_label_pos[0], GLS_label_pos[1]], //pt A
          [
            (82 / 288) * GLS_label_pos[2] -
              (labelHeight / 2) * Math.tan((36 * Math.PI) / 180),
            GLS_label_pos[1],
          ], //pt B
          [(82 / 288) * GLS_label_pos[2], labelHeight / 2], //pt C
          [
            (82 / 288) * GLS_label_pos[2] -
              (labelHeight / 2) * Math.tan((36 * Math.PI) / 180),
            labelHeight,
          ], //pt D
          [GLS_label_pos[0], labelHeight], //pt E
        ])
      : (labelPos[i] = [
          [GLS_label_pos[0], GLS_label_pos[1] + labelPos[i - 1][3][1] + 3], //pt A
          [
            labelPos[i - 1][2][0] +
              ((labelPos[i - 1][4][1] - labelPos[i - 1][0][1]) / 2) *
                Math.tan((36 * Math.PI) / 180),
            GLS_label_pos[1] + labelPos[i - 1][3][1] + 3,
          ], //pt B
          [
            labelPos[i - 1][2][0] +
              (labelHeight / 2 +
                (labelPos[i - 1][4][1] - labelPos[i - 1][0][1]) / 2) *
                Math.tan((36 * Math.PI) / 180),
            labelHeight / 2 + labelPos[i - 1][3][1] + 3,
          ], //pt C
          [
            labelPos[i - 1][2][0] +
              ((labelPos[i - 1][4][1] - labelPos[i - 1][0][1]) / 2) *
                Math.tan((36 * Math.PI) / 180),
            labelHeight + labelPos[i - 1][3][1] + 3,
          ], //pt D
          [GLS_label_pos[0], labelHeight + labelPos[i - 1][3][1] + 3], //pt E
        ]);
  }

  return labelPos;
}

// fonction qui dessine un polygone (coordonnées)
function draw_GLS_polygon(label_pos, color) {
  const GLScvs = document.getElementById("GLScvs");

  ctx = GLScvs.getContext("2d");
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(GLSpadX + label_pos[0][0], GLSpadY + label_pos[0][1]);
  ctx.lineTo(GLSpadX + label_pos[1][0], GLSpadY + label_pos[1][1]);
  ctx.arc(
    GLSpadX + label_pos[1][0],
    GLSpadY + label_pos[2][1],
    (label_pos[3][1] - label_pos[1][1]) / 2,
    Math.PI * 1.5,
    Math.PI * 0.5
  );
  ctx.lineTo(GLSpadX + label_pos[4][0], GLSpadY + label_pos[4][1]);
  ctx.fill();
}

// fonction qui trace le contour du polygone, le cartouche et les lettrages (label_pos, index, GLS Rating)
function draw_GLS_stroke(label_pos, index, rating) {
  let classGLS = set_class_GLS(rating)[1];
  let font1 = "bold " + GLScvsWidth / 200 + "rem verdana";
  let font2 = " " + (0.7 * GLScvsWidth) / 400 + "rem verdana";
  let fontL = "bold " + GLSgraphWidth / 80 + "rem verdana";
  let fontl = "bold " + GLSgraphWidth / 140 + "rem verdana";
  let fontSub = " " + (0.5 * GLScvsWidth) / 400 + "rem verdana";
  let fontConso = "bold" + GLScvsWidth / 500 + "rem verdana";

  const GLScvs = document.getElementById("GLScvs");
  if (index == classGLS) {
    if (GLScvs.getContext) {
      ctx = GLScvs.getContext("2d");
      ctx.fillStyle = "rga(0,0,0,1)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(GLSpadX + label_pos[0][0], GLSpadY + label_pos[0][1]); //pt A
      ctx.lineTo(GLSpadX + label_pos[1][0], GLSpadY + label_pos[1][1]); // pt B
      ctx.arc(
        GLSpadX + label_pos[1][0],
        GLSpadY + label_pos[2][1],
        (label_pos[3][1] - label_pos[1][1]) / 2,
        Math.PI * 1.5,
        Math.PI * 0.5
      );
      ctx.lineTo(GLSpadX + label_pos[4][0], GLSpadY + label_pos[4][1]); // pt E
      ctx.closePath();
      ctx.stroke();

      // ligne horizontale
      ctx.fillStyle = "rga(0,0,0,1)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(
        GLSpadX + label_pos[2][0] + GLSgraphWidth / 20,
        GLSpadY + label_pos[2][1]
      );
      ctx.lineTo(GLSpadX + GLSgraphWidth, GLSpadY + label_pos[2][1]);
      ctx.stroke();

      // texte lettrage GLS
      //let fontSub = " " + (0.5 * DPEcvsWidth) / 400 + "rem verdana";
      ctx.fillStyle = "black";
      ctx.font = font1;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      var text = ctx.measureText(GLS_rating);
      var largeur = text.width;
      ctx.fillText(
        GLS_rating,
        GLSpadX + GLSgraphWidth + 0.025 * GLSgraphWidth,
        GLSpadY + label_pos[2][1],
        0.23 * GLSgraphWidth
      );

      // texte unités GLS
      ctx.fillStyle = "black";
      ctx.font = font2;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";

      ctx.fillText(
        " kgCO",
        GLSpadX + 1.025 * GLSgraphWidth + largeur,
        GLSpadY + label_pos[2][1] + GLSgraphWidth * 0.02,
        0.1 * GLSgraphWidth
      );
      ctx.textBaseline = "top";
      ctx.font = fontSub;
      ctx.fillText(
        "2",
        GLSpadX + 1.125 * GLSgraphWidth + largeur,
        GLSpadY + label_pos[2][1] + GLSgraphWidth * 0.02,
        0.014 * GLSgraphWidth
      );
      ctx.textBaseline = "middle";
      ctx.font = font2;
      ctx.fillText(
        "/m²/an",
        GLSpadX + 1.14 * GLSgraphWidth + largeur,
        GLSpadY + label_pos[2][1] + GLSgraphWidth * 0.02,
        0.12 * GLSgraphWidth
      );

      // incrustation de la lettre
      //let fontL = "bold " + DPEcvsWidth / 130 + "rem verdana";
      ctx.font = fontL;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillStyle = "white";
      ctx.fillText(
        lettres[i],
        GLSpadX + label_pos[0][0] + 0.02 * GLSgraphWidth,
        GLSpadY + label_pos[2][1] + 0.013 * GLSgraphWidth,
        0.15 * GLSgraphWidth
      );
      ctx.strokeText(
        lettres[i],
        GLSpadX + label_pos[0][0] + 0.02 * GLSgraphWidth,
        GLSpadY + label_pos[2][1] + 0.013 * GLSgraphWidth,
        0.15 * GLSgraphWidth
      );
    }
  } else {
    // incrustation des autres lettres
    if (GLScvs.getContext) {
      ctx = GLScvs.getContext("2d");
      //let fontl = "bold " + DPEcvsWidth / 240 + "rem verdana";
      ctx.font = fontl;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillStyle = "white";
      ctx.fillText(
        lettres[i],
        GLSpadX + 0.024 * GLSgraphWidth,
        GLSpadY + 0.01 * GLSgraphWidth + label_pos[2][1],
        0.13 * GLSgraphWidth
      );
    }
  }
}

// fonction qui trace toute l'étiquette (GLS_rating)
function GLS_labelDisplay(GLS_rating) {
  var GLScvs = document.getElementById("GLScvs");
  let positions = new Array();
  let fontl = "normal " + GLScvsWidth / 600 + "rem verdana";
  let fontSub = " " + (0.5 * GLScvsWidth) / 400 + "rem verdana";
  positions = set_GLS_label_position(GLS_rating);
  var ctx = GLScvs.getContext("2d");
  ctx.clearRect(0, 0, GLScvs.width, GLScvs.height);
  ctx.beginPath();

  for (i = 0; i <= 6; i++) {
    // console.log("position = " + positions[i]);
    draw_GLS_polygon(positions[i], `${GLSlabelColors[i]}`);
    draw_GLS_stroke(positions[i], i, GLS_rating);
  }
  // textes en bas et en haut du graph

  texte1 = "peu d'émission de CO";
  if (GLScvs.getContext) {
    ctx = GLScvs.getContext("2d");
    ctx.font = fontl;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = GLSlabelColors[1];
    var text = ctx.measureText(texte1);
    ctx.fillText(
      texte1,
      GLSpadX,
      GLSpadY - 0.05 * GLSgraphWidth,
      0.7 * GLSgraphWidth
    );

    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.font = fontSub;
    ctx.fillStyle = GLSlabelColors[1];
    ctx.fillText(
      "2",
      GLSpadX + text.width,
      GLSpadY - 0.05 * GLSgraphWidth,
      0.7 * GLSgraphWidth
    );

    ctx.font = fontl;
    ctx.fillStyle = GLSlabelColors[6];
    ctx.fillText(
      "émissions très importantes",
      GLSpadX,
      GLSpadY + 1.04 * GLSgraphWidth,
      0.7 * GLSgraphWidth
    );
  }
}

document.getElementById("DPE_ranking").addEventListener("input", (e) => {
  DPE_rating = e.target.value;
});

document.getElementById("GLS_ranking").addEventListener("input", (e) => {
  GLS_rating = e.target.value;
});

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  let affichage = true;
  e.preventDefault();
  console.log("DPE :" + DPE_rating);
  console.log("GLS : " + GLS_rating);
  if (isNaN(DPE_rating) || DPE_rating == "") {
    console.log("ERREUR sur champ DPE!!!");
    document.getElementById("DPEcvs").classList.add("hide");
    document.getElementById("GLScvs").classList.add("hide");
    document.getElementById("DPE_ranking").style.backgroundColor = "plum";
    document.getElementById("DPE_GLS").classList.add("DPE_GLS_NOK");
    affichage = false;
  }
  if (isNaN(GLS_rating) || DPE_rating == "") {
    console.log("ERREUR sur champ GLS!!!");
    document.getElementById("DPEcvs").classList.add("hide");
    document.getElementById("GLScvs").classList.add("hide");
    document.getElementById("GLS_ranking").style.backgroundColor = "plum";
    document.getElementById("DPE_GLS").classList.add("DPE_GLS_NOK");
    affichage = false;
  }
  if (affichage == true) {
    console.log("DPE et GLS renseignés: OK !!!!");
    document.getElementById("DPEcvs").classList.remove("hide");
    document.getElementById("GLScvs").classList.remove("hide");
    document.getElementById("DPE_ranking").style.backgroundColor = "plum";
    document.getElementById("GLS_ranking").style.backgroundColor = "plum";
    document.getElementById("DPE_GLS").classList.remove("DPE_GLS_NOK");
    DPE_labelDisplay(DPE_rating, GLS_rating);
    GLS_labelDisplay(GLS_rating);
  }
});
