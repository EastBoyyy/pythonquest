/* ============ Regroupement des niveaux ============ */
const LEVELS = [NIVEAU1, NIVEAU2, NIVEAU3, NIVEAU4];

/* Total des étapes (leçons + quiz + projets) pour la progression globale */
function compterEtapes() {
  let total = 0;
  for (const niveau of LEVELS) {
    total += niveau.lessons.length;   // leçons
    total += 1;                       // quiz
    total += 1;                       // projet
  }
  return total;
}

const TOTAL_ETAPES = compterEtapes();