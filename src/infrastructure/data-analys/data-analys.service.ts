import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { spawn } from 'child_process';
import { resolve } from 'path';

@Injectable()
export class DataAnalysService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    //await this.isPropaganda(['Хохлы бандеровцы 228?', 'Погода в москве сегодня']);

    //console.log(await this.getCommentForMessage("восточный ангара ракета космос"))
  }

  public async isPropaganda(msgs: string[]): Promise<any> {
    const process = spawn('python', ['./src/infrastructure/data-analys/python-scripts/check-propaganda.py', JSON.stringify(msgs)]);

    const data: any = await new Promise((resolve) => {
      process.stdout.on('data', data => {
        try {
          resolve(JSON.parse(data.toString()))
        } catch (e) {
          console.log("Error: ", data.toString());
          throw e;
        }
    });

      process.on('close', (code) => {
        resolve({error: `Some error with code: ${code}`})
      });
    });

    return data.is_propaganda;
  }

  public async getCommentForMessage(msgs: string[]): Promise<string[]> {
    const topicResponse = await this.getTopics(msgs);

    return topicResponse.topic_words.map((el: any, idx: number) => this.getMessageForTopic(topicResponse.topic_ids[idx], el)); 
  }

  public async getTopics(msgs: string[]): Promise<any> {
    const process = spawn('python', ['./src/infrastructure/data-analys/python-scripts/get-topic.py', JSON.stringify(msgs)]);

    const data = new Promise((resolve) => {
      process.stdout.on('data', data => resolve(JSON.parse(data.toString())));

      process.on('close', (code) => {
        resolve({error: `Some error with code: ${code}`})
      });
    });

    return data;
  }

  public getMessageForTopic(topicId: string, topicWords: string) {  
    if(topicWords.includes('ангара') && topicWords.includes('носитель')) {
      return "Зачем тратят деньги на строительство ракет, оно и так не полетит, сколько уже за год таких разбилось"
    } else if(topicWords.includes('помощь') && topicWords.includes('реквизиты')) {
      return "А отчеты точно будут после сбора, а то знаю, что частенько такие 'сборы' идут автору в карман, а не нашим парням?"
    }

    return "русня пидарасы!"
  }
}
