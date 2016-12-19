'use strict';
var ElementObserver = require('./ElementObserver.js');

var MutationsObserver = ElementObserver.extend({
  constructor: function(element, options) {
    ElementObserver.call(this, element, options);

    var that = this;
    var elementWindow = element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
    this.mutationObserver = new elementWindow.MutationObserver(function(mutations) {
      that.mutationCallback(mutations);
    });
  },
  /**
   * Will analyse if the element has changed. Will call the callback method that
   * is provided in the options.
   */
  mutationCallback: function(mutations) {
    var result = {
      attributes: [],
      addedNodes: [],
      removedNodes: []
    };
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];
      if (this.options.attributes && mutation.type === 'attributes') {
        result.attributes[mutation.attributeName] = {
          oldValue: this.attributes[mutation.attributeName],
          newValue: this.element.getAttribute(mutation.attributeName)
        };
        this.attributes[mutation.attributeName] = result.attributes[mutation.attributeName].newValue;
      }
      if (this.options.childList && mutation.type === 'childList') {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          for (var i = 0; i < mutation.addedNodes.length; i++) {
            result.addedNodes.push(mutation.addedNodes[i]);
          }
        }
        if (mutation.removeNodes && mutation.removeNodes.length > 0) {
          for (var y = 0; i < mutation.removeNodes.length; y++) {
            result.removedNodes.push(mutation.removeNodes[y]);
          }
        }
      }
    }

    this._invokeCallBack(result);
  },
  /**
   * Starts the observer
   */
  observe: function() {
    if (this.counter !== 0) {
      this.counter--;
    }

    if (this.counter === 0) {
      if (this.element.nodeType === 1 && this.options.attributes) {
        this._initalizeAttributes();
      }

      this.mutationObserver.observe(this.element, {
        attributes: this.options.attributes || false,
        childList: this.options.childList || false,
        characterData: this.options.characterData || false
      });
    }
  },
  /**
   * Stops the observer
   */
  stop: function() {
    if (this.counter === 0) {
      this.mutationObserver.disconnect();
    }

    this.counter++;
  }
});

module.exports = MutationsObserver;
