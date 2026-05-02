# Carte Prix Carburant pour Home-Assistant

## Fonctionnalités

Permet d'afficher les stations triés par prix du carburants dans un tableau.

<img width="442" height="281" alt="image" src="https://github.com/user-attachments/assets/5e5d915b-46cb-4638-8f45-bdf9d01488fb" />

## Requis

Basé sur l'intégration HACS [Prix Carburant](https://github.com/Aohzan/hass-prixcarburant) de [Aohzan](https://github.com/Aohzan).

## Installation

### Manuel

**COPIER RÉPERTOIRE**

Copier le répertoire `prix-carburant-card` dans le répertoire: `config/www`.

<img width="748" height="260" alt="image" src="https://github.com/user-attachments/assets/d2beec94-c00f-483e-ab1d-d6f3fe2a34b1" />
<br>

**GESTION DES RESSOUSRCES**

Sur votre Dashboard, sur le crayon en haut a droite, allez dans "Modifier le tableau de bord" > "Gérer les ressources" > "Ajouter une ressource".

<img width="569" height="247" alt="image" src="https://github.com/user-attachments/assets/1041cab6-fd77-4bd2-962c-17810f2384bc" />
<br>

**AJOUTER LA RESSOURCE**

- **URL**: `/local/prix-carburant-card/prix-carburant-card.js`
- **Type**: "Module Javascript"

<img width="631" height="507" alt="image" src="https://github.com/user-attachments/assets/eb0a856d-4f9c-4797-bccc-e3579400f302" />

## Configurations

<img width="1160" height="546" alt="image" src="https://github.com/user-attachments/assets/c33840fd-ad7f-4c1c-9e74-c9a3ca9b1dc7" />

```yaml
type: 'custom:prix-carburant-card'
stations:
 - sensor.prix_carburant_station_1
 - sensor.prix_carburant_station_2
 - sensor.prix_carburant_station_3
 - sensor.prix_carburant_station_4
```
