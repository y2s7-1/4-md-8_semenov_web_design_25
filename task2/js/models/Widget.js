export class Widget {
  constructor({id, type, title, config}) {
    this.id = id;
    this.type = type;
    this.title = title || type[0].toUpperCase()+type.slice(1);
    this.config = config || {};
  }
  toJSON() {
    return { id: this.id, type: this.type, title: this.title, config: this.config };
  }
}
