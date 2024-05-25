import { BaseModel } from './base';

export class Channel extends BaseModel {
  idInSocial: string;
  link: string;
  title: string;
  description: string;
  availableReactions: string[];
  lastPostIdInSocial: string | null;

  constructor(
    idInSocial: string,
    link: string,
    title: string,
    description: string,
    availableReactions: string[],
  ) {
    super();

    this.idInSocial = idInSocial;
    this.link = link;
    this.title = title;
    this.description = description;
    this.availableReactions = availableReactions;
  }
}
