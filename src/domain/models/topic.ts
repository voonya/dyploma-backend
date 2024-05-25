import { BaseModel } from './base';
import { TopicCreation } from './topic-creation';
import { TopicMessage } from './topic-message';

export class Topic extends BaseModel {
  words: string;
  topicDataId: number;
  messages?: TopicMessage[];
  topicCreation?: TopicCreation;
}
