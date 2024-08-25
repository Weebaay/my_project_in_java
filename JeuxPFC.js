// Récupère le score depuis le localStorage (s'il existe) et le convertit en objet
let leScore = JSON.parse(localStorage.getItem('score')) || { victoires: 0, defaites: 0, egalites: 0 };

// Récupère l'historique des parties depuis le localStorage ou initialise un tableau vide
let historique = JSON.parse(localStorage.getItem('historique')) || [];

// Variable pour stocker le nom de l'utilisateur
let nomUtilisateur = localStorage.getItem('nomUtilisateur') || 'Joueur';

let utilisateurs = JSON.parse(localStorage.getItem('utilisateurs')) || {};
// Affiche un message de bienvenue si un nom est deja enregistré
if (nomUtilisateur != 'Joueur') {
	alert('Content de vous revoir, ${nomUtilisateur}!');
}


// Fonction pour saisir le nom de l'utilisateur
function saisirNom() {
    const inputNom = document.getElementById('nomUtilisateur').value; // Récupère le nom saisi dans le champ
    if (inputNom) {
        nomUtilisateur = inputNom; // Met à jour la variable avec le nom saisi

		// si l'utilisateur n'existe pas encor, on l'ajoute
		if (!utilisateurs[nomUtilisateur]) {
			utilisateurs[nomUtilisateur] = {
				score: { victoire: 0, defaite: 0, egalites: 0 },
				historique: []
			};
		}
		// Sauvegarde l'objet complet des utilisateurs dans le localstorage
        localStorage.setItem('nomUtilisateur', nomUtilisateur);
        alert(`Bienvenue, ${nomUtilisateur}!`); // Affiche un message de bienvenue
        miseAJourScore(); // Met à jour l'affichage du score avec le nom
		afficherHistorique();
    } else {
        alert("Veuillez entrer un nom."); // Alerte si aucun nom n'est saisi
    }
}
// Fonction pour mettre à jour l'affichage du score sur la page
function miseAJourScore() {
    document.querySelector('.js-score').innerHTML = `Victoires: ${leScore.victoires} | Défaites: ${leScore.defaites} | Égalités: ${leScore.egalites}`;}

// Fonction pour réinitialiser le score à zéro et mettre à jour l'affichage
function mettreScoreZero() {
    leScore = { victoires: 0, defaites: 0, egalites: 0 }; // Réinitialise les scores à zéro
    localStorage.removeItem('score'); // Supprime les scores du localStorage
    miseAJourScore(); // Met à jour l'affichage avec les scores réinitialisés
}

// Fonction pour générer un choix aléatoire pour l'IA (pierre, feuille, ou ciseaux)
function choisirAI() {
    const randomNumber = Math.random(); // Génère un nombre aléatoire entre 0 et 1
    return randomNumber < 1/3 ? 'pierre' : randomNumber < 2/3 ? 'feuille' : 'ciseaux';
    // Retourne 'pierre' si randomNumber < 1/3, 'feuille' si entre 1/3 et 2/3, et 'ciseaux' si > 2/3
}

// Fonction pour afficher le résultat de la partie avec une animation de glissement
function afficherResultat(resultatPartie) {
    const resultatElement = document.querySelector('.js-resultat'); // Sélectionne l'élément pour afficher le résultat
    resultatElement.innerHTML = resultatPartie; // Affiche le résultat (victoire, défaite ou égalité)
    
    // Réinitialise l'animation de glissement pour chaque nouveau résultat
    resultatElement.classList.remove('visible'); // Retire la classe visible pour redémarrer l'animation
    void resultatElement.offsetWidth; // Force un reflow pour réinitialiser l'animation
    resultatElement.classList.add('visible'); // Réapplique la classe visible pour déclencher l'animation
}
// Fonction pour ajouter un nouveau résultat à l'historique des parties
function ajouterHistorique(resultat, monChoix_, choixAI) {
    const historique = utilisateurs[nomUtilisateur].historique;
    if (historique.length >= 10) {
        historique.shift(); // Supprime le résultat le plus ancien si l'historique dépasse 10 éléments
    }
    historique.push({
        choixUtilisateur: monChoix_,
        choixAI: choixAI,
        resultat: resultat
    });
    localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs)); // Sauvegarde l'historique mis à jour dans le localStorage
    afficherHistorique(); // Met à jour l'affichage de l'historique sur la page
}

// Fonction pour afficher l'historique des parties sur la page
function afficherHistorique() {
    const historiqueElement = document.querySelector('.js-historique'); // Sélectionne l'élément HTML pour l'historique
	const historique = utilisateurs[nomUtilisateur].historique;
    historiqueElement.innerHTML = ''; // Vide l'historique actuel avant de le remplir

    // Créer la table avec en-tête
    let table = `<table style="width:100%; border-collapse: collapse;">
                    <tr>
                        <th style="border: 1px solid #28039a; padding: 8px;">${nomUtilisateur}</th>
                        <th style="border: 1px solid #28039a; padding: 8px;">IA</th>
                        <th style="border: 1px solid #28039a; padding: 8px;">Résultat</th>
                    </tr>`;
    // Ajouter une ligne pour chaque entrée de l'historique
    historique.forEach(item => {
        table += `<tr>
                    <td style="border: 1px solid #28039a; padding: 8px;">${item.choixUtilisateur}</td> <!-- Utilisation correcte de choixUtilisateur -->
                    <td style="border: 1px solid #28039a; padding: 8px;">${item.choixAI}</td>
                    <td style="border: 1px solid #28039a; padding: 8px;">${item.resultat}</td>
                  </tr>`;
    });

    table += `</table>`;
    
    historiqueElement.innerHTML = table; // Affiche la table dans le HTML
}


// Fonction pour réinitialiser l'historique des parties
function reinitialiserHistorique() {
    utilisateurs[nomUtilisateur].historique = []; // Vide le tableau de l'historique
    localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));
    afficherHistorique(); // Met à jour l'affichage pour montrer l'historique vide
}

// Fonction principale pour jouer une partie en fonction du choix de l'utilisateur
function jouer(monChoix_) {
    const choixAI = choisirAI(); // Génère le choix aléatoire de l'IA
    let resultatPartie = ''; // Variable pour stocker le résultat de la partie (victoire, défaite, égalité)

    // Comparaison du choix de l'utilisateur avec celui de l'IA pour déterminer le résultat
    if (monChoix_ === choixAI) {
        resultatPartie = 'egalite'; // Si les choix sont identiques, c'est une égalité
    } else if ((monChoix_ === 'pierre' && choixAI === 'ciseaux') || 
               (monChoix_ === 'feuille' && choixAI === 'pierre') || 
               (monChoix_ === 'ciseaux' && choixAI === 'feuille')) {
        resultatPartie = 'victoire'; // Cas où l'utilisateur gagne
        leScore.victoires++; // Incrémente le nombre de victoires
    } else {
        resultatPartie = 'perdu'; // Cas où l'utilisateur perd
        leScore.defaites++; // Incrémente le nombre de défaites
    }

    // Sauvegarde le score mis à jour dans le localStorage
    localStorage.setItem('score', JSON.stringify(leScore));

    // Met à jour l'affichage du score et affiche le résultat avec animation
    miseAJourScore();
    afficherResultat(resultatPartie);
    
    // Ajoute le résultat à l'historique
    ajouterHistorique(resultatPartie, monChoix_, choixAI);

    // Sélectionne les éléments pour afficher les choix
    const choixUtilisateurElement = document.querySelector('.js-choix-utilisateur');
    const choixIAElement = document.querySelector('.js-choix-ia');
    const vsElement = document.querySelector('.js-vs');

    // Met à jour les éléments avec les choix
    choixUtilisateurElement.textContent = monChoix_;
    choixIAElement.textContent = choixAI;

    // Réinitialise l'animation
    choixUtilisateurElement.classList.remove('visible');
    choixIAElement.classList.remove('visible');
    vsElement.classList.remove('visible');

    // Ajoute un léger délai pour réappliquer l'animation
    setTimeout(() => {
        choixUtilisateurElement.classList.add('visible');
        vsElement.classList.add('visible');
        choixIAElement.classList.add('visible');
    }, 100);
}

// Appelle la fonction pour afficher l'historique des parties lors du chargement de la page
afficherHistorique();
