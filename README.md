# Carte Prix Carburant pour Home-Assistant

## Fonctionnalités

Permet d'afficher les stations triés par prix du carburants dans un tableau.

## Requis

Basé sur l'intégration HACS [Prix Carburant](https://github.com/Aohzan/hass-prixcarburant) de [Aohzan](https://github.com/Aohzan).

## Installation

### Manuel

1. Copier le répertoire `prix-carburant-card` dans le répertoire: `config/www`.
2. "Modifier le tableau de bord" > "Gérer les ressources" > "Ajouter une ressource"
3. "Module Javascript"
4. Ajouter l'URL ci-dessous:
```
/local/prix-carburant-card/prix-carburant-card.js
```

## Configurations

```yaml
type: 'custom:prix-carburant-card'
stations:
 - sensor.prix_carburant_station_1
 - sensor.prix_carburant_station_2
 - sensor.prix_carburant_station_3
 - sensor.prix_carburant_station_4
```
