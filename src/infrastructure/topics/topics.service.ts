import { Injectable } from '@nestjs/common';

import { TopicMessage } from 'src/domain/models';
import { TopicRepository } from '../repository/entities/topic';

@Injectable()
export class TopicsService {
    constructor(
        private readonly topicsRepository: TopicRepository
    ) {}

    public updateTopicMessage(message: TopicMessage) {
        return this.topicsRepository.updateTopicMessage(message);
    }

    public deleteTopicMessage(messageId: string) {
        return this.topicsRepository.deleteTopicMessage(messageId);
    }

    public addTopicMessage(message: TopicMessage, topicId: string) {
        return this.topicsRepository.addMessageToTopic(message, topicId);
    }

    public async getTopics() {
        const results = await this.topicsRepository.getLastTopics();

        return { topics: results };
    }
}
