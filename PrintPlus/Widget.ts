import declare = require('dojo/_base/declare');
import domConstruct = require('dojo/dom-construct');
import domStyle = require('dojo/dom-style');
import domGeometry = require('dojo/dom-geometry');
import lang = require('dojo/_base/lang');
import BaseWidget = require('jimu/BaseWidget');
import Print = require('./PrintPlus');

interface dojoMarginBox {
  l: number
  t: number
  w: number
  h: number
}

class Widget extends BaseWidget {

  baseClass = "jimu-widget-printplus";
  private print: Print;
  private config: any;
  private printPlusNode: HTMLElement;

  constructor(args?: Array<any>) {
    super(lang.mixin({ baseClass: "jimu-widget-printplus" },
     args));
    console.log(`Constructor of ${this.baseClass}`);
  }

  postCreate() {
    super.postCreate();
    this.print = new Print({
      map: this.map,
      printTaskURL: this.config.serviceURL,
      defaultAuthor: this.config.defaultAuthor,
      defaultCopyright: this.config.defaultCopyright,
      defaultTitle: this.config.defaultTitle,
      defaultFormat: this.config.defaultFormat,
      defaultLayout: this.config.defaultLayout,
      defaultDpi: this.config.defaultDpi || 96,
      noTitleBlockPrefix: this.config.noTitleBlockPrefix,
      layoutParams: this.config.layoutParams,
      relativeScale: this.config.relativeScale,
      relativeScaleFactor: this.config.relativeScaleFactor,
      scalePrecision: this.config.scalePrecision,
      mapScales: this.config.mapScales,
      outWkid: this.config.outWkid,
      showLayout: this.config.showLayout,
      showOpacitySlider: this.config.showOpacitySlider,
      domIdPrefix: this.id,
      nls: this.nls
    }).placeAt(this.printPlusNode);
    this.print.startup();
  }

  onSignIn(credential: any){
    super.onSignIn(credential);
    console.log("onSignIn", credential);
    user = user || {};
    if (user.userId) {
      this.print.updateAuthor(user.userId);
    }
  }

  onOpen() {
    super.onOpen();
    this.print._onOpen();
  }

  onClose() {
    super.onClose();
    this.print._onClose();
  }

  resize() {
    super.resize();
    // If the widget docked, its panel will have the same width as the innerWidth of the browser window.
    // Delay for a brief time to allow the panel to attain its full size.
    setTimeout(() => {
      var node = this.getParent().domNode;
      var computedStyle = domStyle.getComputedStyle(node) as undefined;
      var output = domGeometry.getMarginBox(node, computedStyle) as dojoMarginBox;
      var isDocked = Math.abs(window.innerWidth - output.w) <= 1;

      this.print._resize(isDocked);
    }, 100);
  }
  
  // startup() {
  //   super.startup();
  //   console.log(`Startup of ${this.baseClass}`);   
  //   // Without this function, onOpen() is not called on startup - only resize(). 
  // }
}

export = Widget;
