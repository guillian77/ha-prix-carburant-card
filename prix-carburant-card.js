import {
  LitElement,
  html,
  css,
  property
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

/**
 * Custom card to display fuel prices of stations.
 *
 * YAML configuration example:
 * ```yaml
 * type: 'custom:prix-carburant-card'
 * stations:
 *  - sensor.prix_carburant_station_1
 *  - sensor.prix_carburant_station_2
 *  - sensor.prix_carburant_station_3
 *  - sensor.prix_carburant_station_4
 * ```
 *
 * @author Guillian Aufrère
 * @see https://guillian-aufrere.fr
 */
class PrixCarburantCard extends LitElement {
  /**
   * @type {Array<String>} List of values considered as unavailable prices.
   */
  PRIX_CARBURANT_UNAVAILABLES = ["unknown", "unavailable", "none"];

  /**
   * @type {String} Symbol to display when data is unavailable.
   */
  MISSING = "❓";

  /**
   * @type {Array<Object>} Stations ordered by prices.
   */
  stations = [];

  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  /**
   * Set the configuration of the card.
   *
   * @param {Object} config - The configuration object for the card.
   *
   * @throws Will throw an error if the configuration is invalid (e.g., if no stations are defined).
   */
  setConfig(config) {
    if (!config.stations) { throw new Error("You need to define at least one station"); }

    this.config = config;
  }

  /**
   * Called when the element is connected to the DOM.
   */
  connectedCallback() {
    super.connectedCallback();

    this.getStations();

    this.render();
  }

  /**
   * Called when the element is disconnected from the DOM.
   * Used to clean up any resources or event listeners that were set up in connectedCallback.
   */
  disconnectedCallback() {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = undefined;
    }
  }

  /**
   * Get stations ordered by ascending price.
   */
  getStations() {
    const stations = [];

    this.config.stations.forEach((station, index) => {
      const stationState = this.hass.states[station];

      if (index === 0) this.getLastUpdate(stationState.last_updated);

      stations.push({
        price: this.buildStationPrice(stationState),
        brand: stationState.attributes.brand,
        fuel_type: stationState.attributes.fuel_type || this.MISSING,
        name: stationState.attributes.friendly_name || stationState.attributes.name
      });
    });

    this.stations = this.sortAsc(stations);
  }

  /**
   * Build the last update time of a station in minutes.
   *
   * @param {string} lastUpdate - The last update time of the station in ISO format.
   *
   * @returns {number} The number of minutes since the last update.
   */
  getLastUpdate(lastUpdate) {
    const now = new Date();
    const lastUpdateDate = new Date(lastUpdate);

    this.lastUpdate = Math.floor((now - lastUpdateDate) / 1000 / 60);
  }

  /**
   * Build the price of a station, handling unavailable prices.
   *
   * @param {Object} station - The station object to check.
   *
   * @returns {boolean} True if the station's price is unavailable, false otherwise.
   */
  buildStationPrice(station) {
    const isUnavailablePrice = this.PRIX_CARBURANT_UNAVAILABLES.includes(station.state);

    if (isUnavailablePrice) {
      return this.MISSING;
    }

    return station.state;
  }

  /**
   * Sort stations by ascending price.
   *
   * @param {Array<Object>} params - The array of station objects to be sorted.
   *
   * @returns {Array<Object>} The sorted array of station objects, ordered by ascending price.
   */
  sortAsc(params) {
    params.sort((a, b) => {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;
      return priceA - priceB;
    });
    return params;
  }

  /**
   * Template of stations colums.
   *
   * @returns {String} Stations ordered by prices ASC.
   */
  stationTemplate() {
    // Prevent no yet initialized stations.
    if(!this.stations) return html`<tr><th scope="row" colspan="2">Chargement ...</th></tr>`;

    return html`
      ${this.stations.map(station => {
        return html`
          <tr>
            <td>${station.price}€</td>
            <td>${station.fuel_type}</td>
            <td>${station.name}</td>
          </tr>
        `;
      })}
    `;
  }

  /**
   * Render the HTML of the card.
   */
  render() {
    return html`
      <ha-card>
        <div class="container">
          <div class="heading">
            <div class="">Prix carburant</div>
          </div>
          <table>
            <thead>
              <tr>
                <td><b>Prix</b></td>
                <td><b>Type</b></td>
                <td><b>Station</b></td>
              </tr>
            </thead>
            <tbody>
              ${this.stationTemplate()}
            </tbody>
          </table>
          <footer>
            <p>Dernière mise à jour : Il y a ${this.lastUpdate} minute(s)</p>
          </footer>
        </div>
      </ha-card>
    `;
  }

  /**
   * Define the styles for the card.
   *
   * @returns {CSS} The CSS styles for the card.
   */
  static get styles() {
    return css`
      /**
       * ---------------------------------------------------------------------------------------------------------------
       * GENERAL
       * ---------------------------------------------------------------------------------------------------------------
       */
      ha-card {
        padding: 0 16px;
        display: block;
        font-size: 18px;
      }
      .container {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        padding: 12px;
      }

      /**
       * ---------------------------------------------------------------------------------------------------------------
       * CARD HEADING
       * ---------------------------------------------------------------------------------------------------------------
       */
      .heading {
        font-size: 1.2rem;
        font-weight:500;
        text-overflow: ellipsis;
        line-height: 20px;
        margin-bottom: 8px;
      }

      /**
       * ---------------------------------------------------------------------------------------------------------------
       * STATION TABLE
       * ---------------------------------------------------------------------------------------------------------------
       */
      table td {
        font-size: 1rem;
        line-height: 16px;
      }

      /**
       * ---------------------------------------------------------------------------------------------------------------
       * FOOTER
       * ---------------------------------------------------------------------------------------------------------------
       */
      footer {
        color: #333;
        display: flex;
        font-size: 0.8rem;
        font-style: italic;
        justify-content: flex-end;
      }
    `;
  }
}

// Register component
if (!customElements.get("prix-carburant-card")) {
  customElements.define("prix-carburant-card", PrixCarburantCard);
  console.info(
    `%c 🐲 guillian77/prix-carburant-card %c v1.0.0 `,
    'color: green; font-weight: bold;background: black;',
    'background: grey; font-weight: bold; color: #fff'
  )
}

// Register card itself
window.customCards = window.customCards || [];
window.customCards.push({
  type: "prix-carburant-card",
  name: "Content Card",
  preview: false, // Optional - defaults to false
  description: "A custom card made by me!", // Optional
  documentationURL:
    "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card", // Adds a help link in the frontend card editor
});
