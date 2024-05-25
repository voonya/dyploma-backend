import { Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma';
import { Topic } from 'src/domain/models';
import { TopicMessage } from 'src/domain/models';

class TopicRepository {
  constructor(
    @Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
  ) {}

  createMany(data: Topic[]): Promise<Topic[]> {
    return this.prisma.$transaction(
      data.map((topic) => {
        const { topicCreation, messages, ...anotherData } = topic;

        return this.prisma.topic.create({
          data: {
            ...anotherData,
            messages: {
              create: messages.map((el) => ({ message: el.message })),
            },
            topicCreationId: topicCreation.id,
          },
          include: {
            messages: true,
            topicCreation: true,
          },
        });
      }),
    );
    // const record = await this.prisma.po
  }

  addMessageToTopic(
    message: TopicMessage,
    topicId: string,
  ): Promise<TopicMessage> {
    return this.prisma.topicMessage.create({
      data: {
        message: message.message,
        topicId,
      },
    });
  }

  updateTopicMessage(message: TopicMessage): Promise<TopicMessage> {
    return this.prisma.topicMessage.update({
      where: { id: message.id },
      data: message,
    });
  }

  deleteTopicMessage(messageId: string): Promise<TopicMessage> {
    return this.prisma.topicMessage.delete({
      where: { id: messageId },
    });
  }

  async getLastTopics(): Promise<Topic[]> {
    const topicCreation = await this.prisma.topicCreation.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!topicCreation) {
      return [];
    }

    const topics = await this.prisma.topic.findMany({
      where: { topicCreationId: topicCreation.id },
      include: {
        messages: true,
        topicCreation: true,
      },
    });

    return topics;
  }

  async getMessagesForTopic(topicId: string): Promise<TopicMessage[]> {
    return this.prisma.topicMessage.findMany({ where: { topicId } });
  }
}

export { TopicRepository };
