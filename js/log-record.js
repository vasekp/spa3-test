import {dbRequest} from './log-db.js';

export class Record {
  constructor(record) {
    this._static = record;
    this._rev = 0;
    this._lastSave = 0;
    this._timer = null;
    this._autosaveRef = () => this._autosave();
  }

  static from(record) {
    return new Record(record);
  }

  get id() { return this._static.id; }
  get text() { return this._static.text; }
  get date() { return this._static.date; }
  get tag() { return this._static.tag; }
  get geo() { return this._static.geo; }

  set text(text) {
    if(this.view)
      this.view.text = text;
    this._static.text = text;
    this._rev++;
    if(!this._timer)
      this._timer = setInterval(this._autosaveRef, 300);
  }

  set tag(tag) {
    if(this.view)
      this.view.tag = tag;
    this._static.tag = tag;
    dbRequest({query: 'update', store: 'log-rec', record: this._static});
  }

  set geo(geo) {
    if(this.view)
      this.view.geo = geo;
    this._static.geo = geo;
    dbRequest({query: 'update', store: 'log-rec', record: this._static});
  }

  set view(elm) {
    this._view = elm;
    elm.date = this.date;
    elm.text = this.text;
    elm.tag = this.tag;
    elm.geo = this.geo;
  }

  get view() {
    if(this._view) {
      if(this._view.isConnected)
        return this._view;
      else
        return this._view = null;
    } else
      return null;
  }

  _autosave() {
    if(this._lastSave == this._rev || !this._static.id)
      return;
    let rev = this._rev;
    let callback = () => {
      this._lastSave = rev;
      if(rev === this._rev) {
        clearInterval(this._timer);
        this._timer = null;
      }
    }
    dbRequest({query: 'update', store: 'log-rec', record: this._static}, callback);
  }
};
