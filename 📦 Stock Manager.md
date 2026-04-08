# 📦 Stock Manager

![GitHub Pages](https://img.shields.io/github/deployments/fedmol2022-hue/Stock-Manager/github-pages?label=Site%20Web&logo=github)
![Language](https://img.shields.io/github/languages/top/fedmol2022-hue/Stock-Manager?color=yellow&logo=javascript&logoColor=white)
![Last Commit](https://img.shields.io/github/last-commit/fedmol2022-hue/Stock-Manager?label=Mis%20%C3%A0%20jour)

## Description du Projet

**Stock Manager** est une application web progressive (PWA) conçue pour simplifier la gestion d'inventaire en temps réel. Développée spécifiquement pour des besoins propres, elle permet un suivi efficace des entrées et sorties de stock, l'ajout de nouveaux produits via un scanner de codes-barres/QR, et une synchronisation transparente avec Google Sheets. L'application est optimisée pour une utilisation sur mobile et peut fonctionner hors-ligne, garantissant la continuité des opérations même sans connexion internet.

## 🚀 Fonctionnalités Principales

*   **Gestion d'Inventaire en Temps Réel** : Suivi précis des niveaux de stock pour chaque produit.
*   **Scanner Intégré** : Ajout rapide et gestion des produits via la caméra du smartphone (codes-barres et QR codes).
*   **Synchronisation Google Sheets** : Toutes les données (produits, mouvements, configurations) sont stockées et synchronisées avec une feuille de calcul Google Sheets dédiée, offrant une flexibilité et une accessibilité maximales.
*   **Mode Hors-ligne** : Les opérations sont mises en file d'attente et synchronisées automatiquement dès que la connexion internet est rétablie, assurant une productivité ininterrompue.
*   **Tableau de Bord (Dashboard)** : Vue d'ensemble des statistiques clés de l'inventaire, des alertes de stock bas et des mouvements récents.
*   **Alertes de Stock** : Notifications visuelles pour les produits atteignant des seuils critiques ou ayant des dates limites de consommation (DLC) proches.
*   **Historique des Mouvements** : Journal détaillé de toutes les entrées et sorties, filtrable par type et par opérateur.
*   **Exportation de Données** : Possibilité d'exporter l'état du stock et les historiques au format CSV, ainsi que de générer des rapports PDF complets.
*   **Gestion des Utilisateurs** : Système d'authentification par code PIN pour identifier les opérateurs et sécuriser l'accès.
*   **Personnalisation** : Options d'administration pour configurer les identifiants Google Sheets, le nom de l'application, les couleurs, et les rapports automatisés.
*   **Mode Sombre** : Interface utilisateur adaptable pour un confort visuel optimal dans différents environnements lumineux.

## 🛠️ Technologies Utilisées

*   **HTML5, CSS3, JavaScript (Vanilla JS)** : Pour une application légère, rapide et sans dépendances lourdes.
*   **ZXing Library** : Bibliothèque JavaScript pour le décodage des codes-barres et QR codes via la caméra.
*   **Google Sheets API (via Google Apps Script)** : Backend pour le stockage et la gestion des données.
*   **Chart.js** : Pour la visualisation des données (si des graphiques sont implémentés).

## 🚀 Installation et Configuration

Pour déployer et utiliser l'application, suivez les étapes ci-dessous :

### 1. Préparation de Google Sheets

1.  **Créez une copie de la feuille Google Sheets modèle** (si disponible) ou créez une nouvelle feuille avec les onglets nécessaires (`Stock`, `Mouvements`, `Opérateurs`, `Config`, `Ref_Produits`).
2.  **Déployez le script Google Apps Script (GAS)** fourni (généralement `Code.gs`) en tant qu'application web. Assurez-vous que l'accès est configuré pour "Anyone, even anonymous" (ou restreint si vous avez un système d'authentification GAS).
3.  **Récupérez l'URL de déploiement** de votre script GAS. Elle ressemblera à `https://script.google.com/macros/s/AKfycby.../exec`.
4.  **Notez l'ID de votre feuille Google Sheets** (présent dans l'URL de la feuille).
5.  **Générez une clé API Google Cloud** (si nécessaire pour certaines fonctionnalités comme la lecture directe via l'API Sheets, bien que le GAS gère la plupart des interactions).

### 2. Configuration de l'Application Web

1.  Ouvrez le fichier `script.js` dans un éditeur de texte.
2.  Mettez à jour les variables de configuration au début du fichier avec vos propres informations :
    ```javascript
    var SHEET_ID = 'VOTRE_SHEET_ID'; // L'ID de votre feuille Google Sheets
    var API_KEY = 'VOTRE_API_KEY';   // Votre clé API Google (si utilisée)
    var SCRIPT_URL = 'VOTRE_URL_SCRIPT_GAS'; // L'URL de déploiement de votre script GAS
    var APP_TOKEN = 'VOTRE_TOKEN_SECRET'; // Doit correspondre au token défini dans votre script GAS
    ```
    > **Sécurité** : Le `APP_TOKEN` est une mesure de sécurité simple. Assurez-vous qu'il corresponde à celui configuré dans votre script Google Apps Script pour éviter les accès non autorisés.

### 3. Déploiement sur GitHub Pages (ou autre hébergeur)

1.  **Structurez vos fichiers** : Assurez-vous d'avoir `index.html`, `style.css`, `script.js` et `README.md` dans le même dossier racine de votre projet.
2.  **Créez un dépôt GitHub** : Connectez-vous à [GitHub](https://github.com/) et créez un nouveau dépôt public (par exemple, `Stock-Manager`).
3.  **Uploadez vos fichiers** : Téléchargez les quatre fichiers (`index.html`, `style.css`, `script.js`, `README.md`) dans le dépôt GitHub.
4.  **Activez GitHub Pages** :
    *   Allez dans les **Settings** de votre dépôt.
    *   Cliquez sur **Pages** dans le menu latéral.
    *   Sous "Source", sélectionnez la branche `main` (ou `master`) et le dossier `/ (root)`.
    *   Cliquez sur **Save**.
5.  Votre application sera accessible à une URL du type `https://[votre-nom-utilisateur].github.io/[nom-du-depot]/` après quelques minutes.

## 💡 Utilisation

1.  **Authentification** : Au démarrage, sélectionnez votre nom d'utilisateur et entrez votre code PIN.
2.  **Dashboard** : Consultez l'état général de votre stock.
3.  **Scanner** : Utilisez l'onglet "Scanner" pour enregistrer les entrées ou sorties de produits. Activez la caméra pour scanner un code-barres/QR ou entrez le code manuellement.
4.  **Stock** : Visualisez la liste complète des produits, filtrez par catégorie et recherchez des articles spécifiques.
5.  **Export** : Générez des rapports CSV ou PDF de votre inventaire et de vos mouvements.
6.  **Admin** : Gérez les configurations de l'application.

## 📂 Structure du Projet

*   `index.html` : La structure principale de l'application web, incluant les différentes vues (dashboard, scanner, stock, etc.).
*   `style.css` : Contient toutes les règles de style CSS pour l'interface utilisateur, y compris le mode sombre et les animations.
*   `script.js` : Le cœur logique de l'application, gérant les interactions utilisateur, la logique du scanner, la synchronisation avec Google Sheets, la gestion de l'état hors-ligne, et les fonctions d'administration.
*   `README.md` : Ce fichier, fournissant une description détaillée du projet.

## 🔒 Sécurité

*   **Token d'Authentification (`APP_TOKEN`)** : Un token secret est utilisé pour sécuriser les communications entre l'application web et le script Google Apps Script, empêchant les requêtes non autorisées.
*   **Protection XSS** : Les données affichées dans l'interface utilisateur sont échappées pour prévenir les attaques par injection de scripts (XSS).
*   **Clés API** : Bien que l'application soit front-end, les clés API sont gérées avec précaution. Pour une sécurité maximale, les opérations sensibles sont déléguées au Google Apps Script.

## 🤝 Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez améliorer cette application, veuillez suivre les étapes suivantes :

1.  Forker le dépôt.
2.  Créer une nouvelle branche (`git checkout -b feature/nouvelle-fonctionnalite`).
3.  Effectuer vos modifications et les commiter (`git commit -am 'Ajout de nouvelle fonctionnalité'`).
4.  Pousser la branche (`git push origin feature/nouvelle-fonctionnalite`).
5.  Créer une Pull Request.

## 📄 Licence

Ce projet est développé pour ECREPONT Marc et est sous licence propriétaire. Toute reproduction ou utilisation sans autorisation expresse est interdite.

## 📧 Contact

Pour toute question ou suggestion, veuillez contacter ECREPONT Marc  à `fedmol2022@gmail.com`.

---
*Développé avec passion par ECREPONT Marc - 2026*
