sap.ui.define([], function () {
    "use strict";
    return {
      /**
       * Rounds the number unit value to 2 digits
       * @public
       * @param {string} sValue the number string to be rounded
       * @returns {string} sValue with 2 digits rounded
       */
      setColor: function (sValue) {
        if (sValue == "Y") {
            return "sap-icon://discussion-2";
          } else {
            return "sap-icon://comment";
          }
      },

      setColors: function (sValue) {
        if (sValue == "Y") {
            return "#006491";
          } else {
            return "#8875E7";
          }
      },
    };
  });
  