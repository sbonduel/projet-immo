/*const formatDescription = raw => {
if (!raw) return '';

let desc = raw;

// Supprimer adresse et ligne parasite
desc = desc.replace(/\s*Voir l'adresse.+?\n?/i, '');
desc = desc.replace(/Classe énergie.*GES.*$/s, '');

// Retours à la ligne et mise en forme
desc = desc
    .replace(/(Appartement T\d)/g, '\n\n$1')
    .replace(/(\d+ m2 idéalement situé)/gi, '\n\n$1')
    .replace(/(Proximité :|Transports :|Charges :|Taxe foncière :)/gi, '\n\n$1')
    .replace(/((🛏️Chambre  |Salon |Cuisine  |Salle de bains  |wc |Bureau)[^:]*:)/gi, '\n$1')
    .replace(/(\d+ m²)/g, '$1\n')
    .replace(/(🛏️ Chambre \d+ :|🛋️ Salon :|🍽️ Cuisine :|🛁 Salle de bains :|🚽 wc :|💻 Bureau  :)/gi, '• $1');
    return desc.trim();
}; */

const formatDescription = raw => {
    if (!raw) return '';
  
    let desc = raw;
  
    // Suppressions des lignes inutiles
    desc = desc.replace(/Voir l'adresse.+?\n?/gi, '');
    desc = desc.replace(/Voir la visite virtuelle/gi, '');
    desc = desc.replace(/Prix validé par.+?\n?/gi, '');
    desc = desc.replace(/PAP Qu.*?$/gi, '');
    desc = desc.replace(/Adresse : .+?\n?/gi, '');
    desc = desc.replace(/^\s*$/, ''); // Lignes vides
  
    // Supprimer redondance prix/m² dans description
    desc = desc.replace(/\d+\s?€\s?(le|\/) m²/gi, '');
  
    // Supprimer les blocs de fin non descriptifs
    desc = desc.replace(/(Classe énergie|GES) *:.*$/gis, '');
  
    // Format général : sections et blocs
    desc = desc
      .replace(/(Idéalement situé.*?)\n/g, '\n\n🌍 $1\n')
      .replace(/(Très bien desservi.*?)\n/g, '\n🚉 $1\n')
      .replace(/(Au sein d'un immeuble.*?)\n/g, '\n🏢 $1\n')
      .replace(/(Bel appartement.*?)\n/g, '\n🛋️ $1\n')
      .replace(/(Chauffage.*?)(,|\.)/gi, '♨️ $1.\n')
      .replace(/(Double vitrage.*?)(,|\.)/gi, '🪟 $1.\n')
      .replace(/(Parquet.*?)(,|\.)/gi, '🪵 $1.\n')
      .replace(/(Cave)/gi, '🗄️ $1\n')
      .replace(/(Charges de copropriété\s?:)/gi, '\n💸 $1')
      .replace(/(Taxe foncière\s?:)/gi, '\n🏛️ $1');
  
    // Ajout des puces pour la liste de pièces
    desc = desc.replace(/(une|deux|trois|quatre)?\s?(chambre|salle de bains|pièce de vie|wc|entrée|cuisine)[^,.]*[,.]/gi, match => `• ${match.trim()}\n`);
  
    // Nettoyage final
    desc = desc.replace(/\n{3,}/g, '\n\n'); 
    desc = desc.trim();
  
    return desc;
  };
  
  

export default formatDescription;